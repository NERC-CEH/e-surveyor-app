import Occurrence, {
  Attrs as OccurrenceAttrs,
} from '@bit/flumens.apps.models.occurrence';
import { validateRemoteModel } from '@bit/flumens.apps.utils.validation';
import { observable } from 'mobx';
import { Species, Result } from 'common/services/plantNetResponse.d';
import identifyImage, { ResultWithWarehouseID } from 'common/services/plantNet';
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
  rawSuggestions?: Result[];
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

      const {
        version,
        results: suggestions,
        rawResults: rawSuggestions,
      } = await identifyImage(this.media);

      const byScore = (
        sp1: ResultWithWarehouseID,
        sp2: ResultWithWarehouseID
      ) => sp2.score - sp1.score;
      suggestions.sort(byScore);

      const attachSpecies = (media: Media) => {
        media.attrs.species = suggestions; // eslint-disable-line no-param-reassign
      };
      this.media.forEach(attachSpecies);

      const topSuggestion = suggestions[0];
      if (!topSuggestion) return;

      this.attrs.taxon = {
        ...topSuggestion,
        version,
        suggestions,
        rawSuggestions,
      };

      this.identification.identifying = false;
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

    const wasNotIdentified = (media: Media) => !media.attrs.species;
    return this.media.some(wasNotIdentified);
  }

  // 'filter' instead of 'some' to trigger mobx listeners to all media objects
  isIdentifying = () => this.identification.identifying;
}
