import { Occurrence } from '@flumens';
import Media from './image';

export default class AppOccurrence extends Occurrence {
  static fromJSON(json) {
    return super.fromJSON(json, Media);
  }

  getSpecies = () => this.attrs.taxon;

  // eslint-disable-next-line class-methods-use-this
  validateRemote() {
    return null;
  }

  isDisabled = () => this.isUploaded();

  setSpecies(species) {
    const defaultSpecies = {
      warehouseId: 0,
      gbif: { id: 0 },
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
    const identifyAllImages = media => media.identify();

    // [sp1, null, sp3, sp1 ]
    const species = await Promise.all(this.media.map(identifyAllImages));

    const byScore = (sp1, sp2) => sp2.score - sp1.score;
    species.sort(byScore);

    if (!species[0]) return;

    this.setSpecies(species[0]);
    this.save();
  }

  canReIdentify() {
    if (!this.media.length) return false;

    const wasNotIdentified = media => !media.attrs.species;
    return this.media.some(wasNotIdentified);
  }

  // 'filter' instead of 'some' to trigger mobx listeners to all media objects
  isIdentifying = () =>
    !!this.media.filter(media => media.isIdentifying()).length;
}
