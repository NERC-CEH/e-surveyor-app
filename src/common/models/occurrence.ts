import Occurrence, {
  Attrs as OccurrenceAttrs,
} from '@bit/flumens.apps.models.occurrence';
import { validateRemoteModel } from '@bit/flumens.apps.utils.validation';
import { observable } from 'mobx';
import { Species } from 'common/services/plantNetResponse.d';
import identifyImage, {
  ResultWithWarehouseID,
  filterUKSpecies,
} from 'common/services/plantNet';
import Media from './image';

export type Taxon = Optional<
  Omit<ResultWithWarehouseID, 'species'>,
  'images'
> & {
  isUserSet?: boolean;
  species: OptionalExcept<
    Species,
    'commonNames' | 'scientificNameWithoutAuthor'
  >;
  suggestions?: ResultWithWarehouseID[];
  version?: string;
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

      const { version, results: suggestions } = await identifyImage(this.media);

      this.identification.identifying = false;

      const byScore = (
        sp1: ResultWithWarehouseID,
        sp2: ResultWithWarehouseID
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
        ...topSuggestion,
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
}
