import Occurrence, {
  Attrs as OccurrenceAttrs,
} from '@bit/flumens.apps.models.occurrence';
import { observable } from 'mobx';
import identifyImage from 'common/services/plantNet';
import Media from './image';

export type Species = {
  warehouseId: number;
  gbif?: { id: string };
  score: number;
  species: {
    commonNames: string[];
    scientificNameWithoutAuthor: string;
  };
};

type Attrs = OccurrenceAttrs & { taxon?: Species };

export default class AppOccurrence extends Occurrence {
  static fromJSON(json: any) {
    return super.fromJSON(json, Media);
  }

  identification = observable({ identifying: false });

  attrs: Attrs = this.attrs;

  getSpecies = () => this.attrs.taxon;

  // eslint-disable-next-line class-methods-use-this
  validateRemote() {
    return null;
  }

  isDisabled = () => this.isUploaded();

  setSpecies(species: Partial<Species>) {
    const defaultSpecies = {
      warehouseId: 0,
      gbif: { id: '' },
      images: [],
      score: 0,
      species: {
        commonNames: [],
        scientificNameWithoutAuthor: '',
      },
    };

    this.attrs.taxon = { ...defaultSpecies, ...species };
  }

  async identify() {
    try {
      this.identification.identifying = true;

      const species = await identifyImage(this.media);

      const byScore = (sp1: Species, sp2: Species) => sp2.score - sp1.score;
      species.sort(byScore);

      this.media.forEach((media: Media) => {
        // eslint-disable-next-line no-param-reassign
        media.attrs.species = species;
      });

      if (!species[0]) return;

      this.setSpecies(species[0]);

      this.identification.identifying = false;
    } catch (error) {
      this.identification.identifying = false;
      throw error;
    }

    const isPartOfSurvey = this.parent;
    if (!isPartOfSurvey) return;

    this.save();
  }

  canReIdentify() {
    if (!this.media.length) return false;

    const wasNotIdentified = (media: Media) => !media.attrs.species;
    return this.media.some(wasNotIdentified);
  }

  // 'filter' instead of 'some' to trigger mobx listeners to all media objects
  isIdentifying = () => this.identification.identifying;
}
