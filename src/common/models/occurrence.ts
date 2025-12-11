import { IObservableArray, observable } from 'mobx';
import {
  Occurrence as OccurrenceOriginal,
  OccurrenceAttrs,
  validateRemoteModel,
} from '@flumens';
import config from 'common/config';
import blackListedData from 'common/data/cacheRemote/uksi_plants_blacklist.json';
import identifyImage from 'common/services/indiciaAI';
import { IndiciaAISuggestion } from 'common/services/indiciaAI/indiciaAIResponse';
import {
  Image,
  Response as PlantNetResponse,
} from 'common/services/indiciaAI/plantNetResponse.d';
import beetleSurveyConfig from 'Survey/Beetle/config';
import mothSurveyConfig, { UNKNOWN_SPECIES } from 'Survey/Moth/config';
import { MachineInvolvement, Survey } from 'Survey/common/config';
import Media from './image';
import Sample from './sample';
import userModel from './user';

type PlantNetTaxonAttrs = {
  images?: Image[];
};

export type Suggestion = {
  warehouseId: number;
  probability: number;
  commonNames: string[];
  scientificName: string;
  tvk: string;
} & PlantNetTaxonAttrs;

type ClassifierAttributes = {
  probability: number;
  version?: string;
  suggestions?: Suggestion[];
  machineInvolvement?: MachineInvolvement;
  recordCleaner?: IndiciaAISuggestion['record_cleaner'];
};

export type Taxon = {
  warehouseId: number;
  taxonGroupId?: number;
  preferredTaxaTaxonListId?: number;
  commonName: string;
  scientificName: string;
  foundInName?: string;
  tvk: string;
} & ClassifierAttributes &
  PlantNetTaxonAttrs;

type Data = OccurrenceAttrs & { taxon?: Taxon };

export default class Occurrence extends OccurrenceOriginal<Data> {
  declare media: IObservableArray<Media>;

  declare parent?: Sample;

  declare getSurvey: () => Survey;

  constructor(options: any) {
    super({ ...options, Media });
  }

  identification = observable({ identifying: false });

  getSpecies = (): Taxon => this.data.taxon;

  validateRemote = validateRemoteModel;

  async identify() {
    if (!this.media.length)
      throw new Error('Occurrence media is missing for automatic ID.');

    try {
      this.identification.identifying = true;

      switch (this.parent?.data.surveyId) {
        case beetleSurveyConfig.id:
          await this.identifyBeetle();
          break;
        case mothSurveyConfig.id:
          await this.identifyMoth();
          break;
        default:
          await this.identifyPlant();
      }

      this.identification.identifying = false;
    } catch (error) {
      this.identification.identifying = false;
      throw error;
    }
  }

  async identifyBeetle() {
    await this.media[0].uploadFile();
    const url = this.media[0].getRemoteURL();

    const res = await identifyImage({
      model: 'waarneming',
      images: [url],
      url: config.backend.url,
      getAccessToken: () => userModel.getAccessToken(),
      listId: 280, // beetles
    });

    const { classifierVersion, suggestions } = res;

    const byScore = (sp1: Suggestion, sp2: Suggestion) =>
      sp2.probability - sp1.probability;
    suggestions.sort(byScore);

    this.media[0].data.identified = true;

    const topSuggestion = suggestions[0];
    const isNonUKSpecies = !Number.isFinite(topSuggestion?.warehouseId);
    if (!topSuggestion || isNonUKSpecies) return;

    const taxon: Taxon = {
      probability: topSuggestion.probability,
      warehouseId: topSuggestion.warehouseId,
      scientificName: topSuggestion.scientificName,
      commonName: topSuggestion.commonNames[0],
      machineInvolvement: MachineInvolvement.MACHINE,
      version: `${classifierVersion}`,
      suggestions,
      tvk: '',
    };

    this.data.taxon = taxon;
    this.save();
  }

  async identifyPlant() {
    const date = this.createdAt;
    const location =
      this.parent?.data.location || this.parent?.parent?.data.location;

    const upload = (img: Media) => img.uploadFile();
    await Promise.all(this.media.map(upload));

    const res = await identifyImage<PlantNetResponse>({
      model: 'plantnet',
      images: this.media.map(m => m.getRemoteURL()),
      url: config.backend.url,
      getAccessToken: () => userModel.getAccessToken(),
      listId: 15, // UKSI
      date,
      location,
    });

    const { classifierVersion, suggestions, raw } = res;

    const blacklisted = blackListedData.map(sp => sp.taxon);

    const getPlantNetImages = (taxon: string) =>
      raw?.results?.find(
        ({ species }) => species.scientificNameWithoutAuthor === taxon
      )?.images || [];

    const cleanSuggestions = suggestions
      .filter(sp => !blacklisted.includes(sp.scientificName)) // blacklisted
      .filter(sp => sp.probability > 0.2) // high score
      .map(sp => ({ ...sp, images: getPlantNetImages(sp.scientificName) }));

    const attachSpecies = (media: Media) => {
      media.data.identified = true; // eslint-disable-line no-param-reassign
    };
    this.media.forEach(attachSpecies);

    const topSuggestion = cleanSuggestions[0];
    if (!topSuggestion) {
      this.data.taxon = null;
      return;
    }

    this.data.taxon = {
      probability: topSuggestion.probability,
      warehouseId: topSuggestion.warehouseId,
      scientificName: topSuggestion.scientificName,
      commonName: topSuggestion.commonNames[0],
      machineInvolvement: MachineInvolvement.MACHINE,
      version: classifierVersion,
      suggestions: cleanSuggestions,
      tvk: topSuggestion.tvk,
      recordCleaner: topSuggestion.recordCleaner,

      // plantNet-specific
      images: topSuggestion.images,
    } as Taxon;

    if (!this.isPersistent()) return;

    this.save();
  }

  async identifyMoth() {
    await this.media[0].uploadFile();
    const url = this.media[0].getRemoteURL();

    const res = await identifyImage({
      model: 'waarneming',
      images: [url],
      url: config.backend.url,
      getAccessToken: () => userModel.getAccessToken(),
      listId: 61, // iRecord Moths
    });

    const { classifierVersion, suggestions } = res;

    const byScore = (sp1: Suggestion, sp2: Suggestion) =>
      sp2.probability - sp1.probability;
    suggestions.sort(byScore);

    this.media[0].data.identified = true;

    const topSuggestion = suggestions[0];
    const isNonUKSpecies = !Number.isFinite(topSuggestion?.warehouseId);
    if (!topSuggestion || isNonUKSpecies) {
      this.data.taxon = UNKNOWN_SPECIES;
      return;
    }

    this.data.taxon = {
      probability: topSuggestion.probability,
      warehouseId: topSuggestion.warehouseId,
      scientificName: topSuggestion.scientificName,
      commonName: topSuggestion.commonNames[0],
      machineInvolvement: MachineInvolvement.MACHINE,
      version: `${classifierVersion}`,
      suggestions,
      tvk: '',
    } as Taxon;

    this.save();
  }

  isPersistent() {
    return !!this.parent;
  }

  canReIdentify() {
    if (!this.media.length) return false;

    const wasNotIdentified = (media: Media) => !media.data.identified;
    return this.media.some(wasNotIdentified);
  }

  // 'filter' instead of 'some' to trigger mobx listeners to all media objects
  isIdentifying = () => this.identification.identifying;

  getTaxonName() {
    const { taxon } = this.data;
    if (!taxon) return '';

    if (taxon.foundInName) return taxon[taxon.foundInName];

    return taxon.commonName || taxon.scientificName;
  }
}
