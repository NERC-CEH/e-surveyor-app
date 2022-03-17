import Occurrence, {
  Attrs as OccurrenceAttrs,
} from '@bit/flumens.apps.models.occurrence';
import { validateRemoteModel } from '@bit/flumens.apps.utils.validation';
import { observable } from 'mobx';
import { Species } from 'common/services/plantNetResponse.d';
import identifyImage, { ResultWithWarehouseID } from 'common/services/plantNet';
import Media from './image';

export type Taxon = Optional<
  Omit<ResultWithWarehouseID, 'species'>,
  'images'
> & {
  scoreFromAPI?: number; // if user overwrites the main score
  species: OptionalExcept<
    Species,
    'commonNames' | 'scientificNameWithoutAuthor'
  >;
};

type Attrs = OccurrenceAttrs & { taxon?: Taxon };

export default class AppOccurrence extends Occurrence {
  static fromJSON(json: any) {
    return super.fromJSON(json, Media);
  }

  identification = observable({ identifying: false });

  attrs: Attrs = this.attrs;

  media: Media[] = this.media;

  getSpecies = () => this.attrs.taxon;

  validateRemote = validateRemoteModel;

  isDisabled = () => this.isUploaded();

  async identify() {
    try {
      this.identification.identifying = true;

      const species = await identifyImage(this.media);

      const byScore = (
        sp1: ResultWithWarehouseID,
        sp2: ResultWithWarehouseID
      ) => sp2.score - sp1.score;
      species.sort(byScore);

      this.media.forEach((media: Media) => {
        // eslint-disable-next-line no-param-reassign
        media.attrs.species = species;
      });

      if (!species[0]) return;

      [this.attrs.taxon] = species;

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
