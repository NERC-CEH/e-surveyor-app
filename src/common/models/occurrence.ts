import { IObservableArray, observable } from 'mobx';
import {
  Occurrence as OccurrenceOriginal,
  OccurrenceAttrs,
  validateRemoteModel,
} from '@flumens';
import identifyBeetleImage from 'common/services/beetles';
import { filterUKSpecies } from 'common/services/helpers';
import identifyPlantImage, {
  ResponseResult as PlantNetResult,
} from 'common/services/plantNet';
import { Image, Gbif } from 'common/services/plantNet/plantNetResponse.d';
import identifyMothImage from 'common/services/waarneming';
import { UNKNOWN_SPECIES } from 'Survey/Moth/config';
import { MachineInvolvement, Survey } from 'Survey/common/config';
import Media from './image';
import Sample from './sample';

type PlantNetTaxonAttrs = {
  images?: Image[];
  gbif?: Gbif;
};

export type Suggestion = {
  warehouseId: number;
  score: number;
  commonNames: string[];
  scientificName: string;
} & PlantNetTaxonAttrs;

type ClassifierAttributes = {
  score: number;
  version?: string;
  suggestions?: Suggestion[];
  machineInvolvement?: MachineInvolvement;
};

export type Taxon = {
  warehouseId: number;
  commonName: string;
  scientificName: string;
} & ClassifierAttributes &
  PlantNetTaxonAttrs;

type Attrs = OccurrenceAttrs & { taxon?: Taxon };

export default class Occurrence extends OccurrenceOriginal<Attrs> {
  static fromJSON(json: any) {
    return super.fromJSON(json, Media);
  }

  declare media: IObservableArray<Media>;

  declare parent?: Sample;

  declare getSurvey: () => Survey;

  constructor(...args: any[]) {
    super(...args);

    // backwards compatible, migrate old species suggestions
    const oldSpecies = (this.attrs.taxon as any)?.species;
    if (this.attrs.taxon && oldSpecies) {
      console.log('Migrating old species suggestions');

      this.attrs.taxon.commonName = oldSpecies.commonNames[0]; // eslint-disable-line
      this.attrs.taxon.scientificName = oldSpecies.scientificNameWithoutAuthor;

      if (this.attrs.taxon.suggestions) {
        this.attrs.taxon.suggestions = this.attrs.taxon.suggestions.map(
          (suggestion: any): any => ({
            ...suggestion,
            scientificName: suggestion.species.scientificNameWithoutAuthor,
            commonNames: suggestion.species.commonNames,
          })
        );
      }
      delete (this.attrs.taxon as any)?.species;
      this.save();
    }
  }

  identification = observable({ identifying: false });

  getSpecies = () => this.attrs.taxon;

  validateRemote = validateRemoteModel;

  isDisabled = () => this.isUploaded();

  identify = () => {
    switch (this.parent?.metadata.survey) {
      case 'beetle':
        return this.identifyBeetle();
      case 'moth':
        return this.identifyMoth();
      default:
        return this.identifyPlant();
    }
  };

  async identifyBeetle() {
    try {
      this.identification.identifying = true;

      const { version, results: suggestions } = await identifyBeetleImage(
        this.media
      );

      this.identification.identifying = false;

      const byScore = (
        sp1: Pick<PlantNetResult, 'score'>,
        sp2: Pick<PlantNetResult, 'score'>
      ) => sp2.score - sp1.score;
      suggestions.sort(byScore);

      const attachSpecies = (media: Media) => {
        media.attrs.identified = true; // eslint-disable-line no-param-reassign
      };
      this.media.forEach(attachSpecies);

      const topSuggestion = suggestions[0];
      if (!topSuggestion) return;

      this.attrs.taxon = {
        score: topSuggestion.score,
        warehouseId: topSuggestion.warehouseId,
        scientificName: topSuggestion.scientificName,
        commonName: topSuggestion.commonNames[0],
        machineInvolvement: MachineInvolvement.MACHINE,
        version,
        suggestions,
      };
    } catch (error) {
      this.identification.identifying = false;
      throw error;
    }

    if (!this.isPersistent()) return;

    this.save();
  }

  async identifyPlant() {
    try {
      this.identification.identifying = true;

      const { version, results: suggestions } = await identifyPlantImage(
        this.media
      );

      this.identification.identifying = false;

      const byScore = (
        sp1: Pick<PlantNetResult, 'score'>,
        sp2: Pick<PlantNetResult, 'score'>
      ) => sp2.score - sp1.score;
      suggestions.sort(byScore);

      const UKSuggestions = filterUKSpecies(suggestions);

      const attachSpecies = (media: Media) => {
        media.attrs.identified = true; // eslint-disable-line no-param-reassign
      };
      this.media.forEach(attachSpecies);

      const topSuggestion = UKSuggestions[0];
      if (!topSuggestion) return;

      this.attrs.taxon = {
        score: topSuggestion.score,
        warehouseId: topSuggestion.warehouseId,
        scientificName: topSuggestion.scientificName,
        commonName: topSuggestion.commonNames[0],
        machineInvolvement: MachineInvolvement.MACHINE,
        version,
        suggestions,

        // plantNet-specific
        images: topSuggestion.images,
        gbif: topSuggestion.gbif,
      };
    } catch (error) {
      this.identification.identifying = false;
      throw error;
    }

    if (!this.isPersistent()) return;

    this.save();
  }

  async identifyMoth() {
    if (!this.media.length)
      throw new Error('Occurrence media is missing for automatic ID.');

    try {
      this.identification.identifying = true;

      await this.media[0].uploadFile();
      const url = this.media[0].getRemoteURL();

      const { version, results: suggestions } = await identifyMothImage(url);

      this.identification.identifying = false;

      const byScore = (sp1: Suggestion, sp2: Suggestion) =>
        sp2.score - sp1.score;
      suggestions.sort(byScore);

      this.media[0].attrs.identified = true;

      const topSuggestion = suggestions[0];
      if (!topSuggestion) {
        this.attrs.taxon = UNKNOWN_SPECIES;
        return;
      }

      this.attrs.taxon = {
        score: topSuggestion.score,
        warehouseId: topSuggestion.warehouseId,
        scientificName: topSuggestion.scientificName,
        commonName: topSuggestion.commonNames[0],
        machineInvolvement: MachineInvolvement.MACHINE,
        version,
        suggestions,
      };
    } catch (error) {
      this.identification.identifying = false;
      throw error;
    }

    this.save();
  }

  isPersistent() {
    return !!this.parent;
  }

  canReIdentify() {
    if (!this.media.length) return false;

    const wasNotIdentified = (media: Media) => !media.attrs.identified;
    return this.media.some(wasNotIdentified);
  }

  // 'filter' instead of 'some' to trigger mobx listeners to all media objects
  isIdentifying = () => this.identification.identifying;

  getTaxonName() {
    const { taxon } = this.attrs;
    if (!taxon) return '';

    if (taxon.foundInName) return taxon[taxon.foundInName];

    return taxon.commonName || taxon.scientificName;
  }
}
