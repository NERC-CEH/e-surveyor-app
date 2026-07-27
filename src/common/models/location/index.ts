import { IObservableArray, observable, toJS } from 'mobx';
import axios from 'axios';
import {
  LocationModel as IndiciaLocation,
  LocationOptions,
  LocationData,
  LocationMetadata,
} from '@flumens';
import { copyObject } from '@flumens/models/dist/Model';
import config from 'common/config';
import survey, { HABITAT_ID } from 'Survey/Habitat/Location/config';
import ukhabData from '../../data/ukhab/data.json';
import warehouseIDs from '../../data/ukhab/warehouseIDs.json';
import GPSExtension from '../GPSExt';
import Media from '../image';
import { locationsStore } from '../store';
import userModel from '../user';
import { predictUkhabHabitats as predictUKHabHabitats } from './services/habitat';

export { locationDtoSchema as dtoSchema, LocationType } from '@flumens';

type Data = LocationData;
type Metadata = LocationMetadata & {
  habitatSuggestions?: HabitatSuggestion[];
};

const getUKHabDefinition = (code: string): string | undefined => {
  const entry = (ukhabData as Record<string, any>)[code];
  return entry?.definition;
};

export type HabitatSuggestion = {
  name: string;
  code: string;
  confidence: number;
  definition?: string;
};

type Options<T, R> = { skipStore?: boolean } & LocationOptions<T, R>;

export default class Location<
  T extends LocationData = Data,
  R extends LocationMetadata = Metadata,
> extends IndiciaLocation<T, R> {
  declare media: IObservableArray<Media>;

  identification = observable({ identifying: false });

  startGPS!: (
    newLocation: (loc: {
      latitude: number;
      longitude: number;
      accuracy?: number;
    }) => void,
    accuracyLimit?: number
  ) => Promise<void>;

  stopGPS: any;

  isGPSRunning: any;

  constructor({ skipStore, ...options }: Options<T, R> = {}) {
    super({
      ...options,
      store: skipStore ? undefined : locationsStore,
      Media,
      url: config.backend.indicia.url,
      getAccessToken: () => userModel.getAccessToken(),
    });

    Object.assign(this, GPSExtension());
  }

  async identifyHabitat(): Promise<HabitatSuggestion[]> {
    if (!this.media.length) return [];

    this.identification.identifying = true;

    try {
      const upload = (img: Media) => img.uploadFile();
      await Promise.all(this.media.map(upload));

      const imageUrls = this.media.map(img => img.getRemoteURL());
      const predictions = await predictUKHabHabitats(imageUrls);

      this.identification.identifying = false;

      return predictions.map(({ name, code, confidence, definition }) => ({
        name,
        code,
        confidence,
        definition: definition || getUKHabDefinition(code),
      }));
    } catch (error) {
      this.identification.identifying = false;
      throw error;
    }
  }

  getSurvey() {
    return survey;
  }

  isPersistent() {
    return false;
  }

  get isDisabled(): boolean {
    return this.isUploaded;
  }

  /**
   * Returns a clean (no observables) JSON representation of the model.
   */
  toJSON() {
    const json = super.toJSON();

    return copyObject({
      ...json,
      metadata: toJS(this.metadata) || {},
      media: this.media?.map(model => model.toJSON()) || [],
    });
  }

  // TODO: temporary fix
  async save() {
    // if (this.data.deleted) return; // we don't want to store deleted samples yet

    // if (this.parent) {
    //   this.parent.save();
    //   return;
    // }

    if (!this.store) {
      throw new Error('Trying to sync locally without a store');
    }

    const { data, metadata, media, ...other } = this.toJSON();
    const jsonWithDataWrapper = {
      ...other,
      data: { data, metadata, media },
    };
    await this.store.save(jsonWithDataWrapper);
  }

  async saveRemote() {
    await super.saveRemote();
    await this.saveClassifierResults();
    return this;
  }

  private async saveClassifierResults() {
    try {
      console.log('Location classifier uploading');
      this.remote.synchronising = true;

      const url = `${this.remote.url}/index.php/services/rest/classification-events`;

      const accessToken = await this.remote.getAccessToken!();

      const mediaPaths = this.media.map(media => media.data.queued);

      /* eslint-disable @typescript-eslint/naming-convention */

      const { habitatSuggestions } = this.metadata as any;
      const suggestions = habitatSuggestions.map(
        (suggestion: HabitatSuggestion) => ({
          values: {
            location_attribute_id: HABITAT_ID,
            termlists_term_id: (warehouseIDs as any)[suggestion.code],
            term_given: suggestion.code,
            probability_given: suggestion.confidence,
          },
        })
      );

      const submission = {
        values: { created_by_id: null },
        classification_results: [
          {
            values: { classifier_id: 1, classifier_version: '1' },
            classification_lookup_suggestions: suggestions,
            metaFields: { mediaPaths },
          },
        ],
      };
      /* eslint-enable @typescript-eslint/naming-convention */

      const options: any = {
        url,
        method: 'post',
        headers: { Authorization: `Bearer ${accessToken}` },
        timeout: 80000,
        data: submission,
      };

      await axios(options);

      this.remote.synchronising = false;

      console.log('Location classifier uploading done');
      return this;
    } catch (e: any) {
      this.remote.synchronising = false;

      // throw e; // silently fail for now, we don't want to block the user from continuing
      return this;
    }
  }
}
