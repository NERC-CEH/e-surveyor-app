import Occurrence, {
  Attrs as OccurrenceAttrs,
} from '@bit/flumens.apps.models.occurrence';
import { ResultWithWarehouseID } from 'common/services/plantNet';
import Media from './image';

export type Species = ResultWithWarehouseID;

type Attrs = OccurrenceAttrs & { taxon?: Species };

export default class AppOccurrence extends Occurrence {
  static fromJSON(json: any) {
    return super.fromJSON(json, Media);
  }

  attrs: Attrs = this.attrs;

  getSpecies = () => this.attrs.taxon;

  // eslint-disable-next-line class-methods-use-this
  validateRemote() {
    return null;
  }

  isDisabled = () => this.isUploaded();

  setSpecies(species: Species) {
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
    const identifyAllImages = (media: Media) => media.identify();

    // [sp1, null, sp3, sp1 ]
    const species = await Promise.all(this.media.map(identifyAllImages));

    const byScore = (sp1: Species, sp2: Species) => sp2.score - sp1.score;
    species.sort(byScore);

    if (!species[0]) return;

    this.setSpecies(species[0]);
    const isPartOfSurvey = this.parent;
    if (isPartOfSurvey) this.save();
  }

  canReIdentify() {
    if (!this.media.length) return false;

    const wasNotIdentified = (media: Media) => !media.attrs.species;
    return this.media.some(wasNotIdentified);
  }

  // 'filter' instead of 'some' to trigger mobx listeners to all media objects
  isIdentifying = () =>
    !!this.media.filter(media => media.isIdentifying()).length;
}
