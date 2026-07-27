import { reaction } from 'mobx';
import axios from 'axios';
import { camelCase, map, mapKeys, mapValues } from 'lodash';
import { ZodError } from 'zod';
import {
  device,
  HandledError,
  isAxiosNetworkError,
  LocationCollection as LocationCollectionBase,
  LocationType as LocType,
} from '@flumens';
import type { Options as LocationCollectionOptions } from '@flumens/models/dist/Indicia/LocationCollection';
import config from 'common/config';
import Location, { dtoSchema } from 'models/location';
import userModel from 'models/user';
import { locationsStore } from '../store';

export class LocationsCollection<
  T extends Location = Location,
> extends LocationCollectionBase<T> {
  constructor(options: LocationCollectionOptions<T>) {
    super(options);

    const fetchFirstTime = () => {
      if (
        !this.data.length &&
        device.isOnline &&
        userModel.isLoggedIn() &&
        !this.isSynchronising
      ) {
        this.fetchRemote().catch();
      }
    };

    this.ready?.then(fetchFirstTime);

    const onLoginChange = async (newEmail: any) => {
      if (!newEmail) return;

      await this.ready;

      console.log(`📚 Collection: ${this.id} collection email has changed`);
      fetchFirstTime();
    };
    const getEmail = () => userModel.data.email;
    reaction(getEmail, onLoginChange);
  }

  async fetch() {
    if (!this.store || !this.Model) {
      this.ready.resolve(false);
      return;
    }

    const modelsJSON = await this.store.findAll();

    const getModel = (json: any) => {
      const { data, metadata, media } = json.data;
      return new this.Model({
        ...json,
        data,
        metadata,
        media,
      });
    };
    const models = modelsJSON.map(getModel);
    this.data.push(...models);

    this.ready.resolve(true);
  }

  async fetchRemote() {
    console.log(`📚 Collection: ${this.id} fetching`);
    this.remote.synchronising = true;

    const docs = await this.fetchRemoteByType(LocType.Site);
    const mediaDocs = await this.fetchRemoteMedia();

    const Model = this.Model as unknown as typeof Location;
    const newModels = docs.map(doc => {
      const media = mediaDocs.filter(m => m.parentId === doc.cid);
      return Model.fromDTO(doc, { media }) as T;
    });
    this.upsert(...newModels);
    await Promise.all(newModels.map(m => m.save()));

    await this.removeStaleLocalModels(newModels, [LocType.Site]);

    this.remote.synchronising = false;

    console.log(`📚 Collection: ${this.id} collection fetching done`);
  }

  private async fetchRemoteByType(
    locationTypeId: number | string,
    publicLocations = false
  ): Promise<any[]> {
    const url = `${this.remote.url}/index.php/services/rest/locations`;

    const token = await userModel.getAccessToken();

    /* eslint-disable @typescript-eslint/naming-convention */
    const options = {
      params: {
        location_type_id: locationTypeId,
        public: publicLocations,
        verbose: 1,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 80000,
    };
    /* eslint-enable @typescript-eslint/naming-convention */

    try {
      const res = await axios.get(url, options);

      const getValues = (doc: any) =>
        mapKeys(doc.values, (_, key) =>
          key.includes(':') ? key : camelCase(key)
        );
      const unverboseify = (doc: any) =>
        mapValues(doc, (val, key) => {
          if (!key.includes('locAttr:')) return val;
          if (Array.isArray(val)) return map(val, (i: any) => i.raw_value || i);
          return val.raw_value || val;
        });
      const docs = res.data.map(getValues).map(unverboseify);

      docs.forEach(dtoSchema.parse);

      return docs;
    } catch (error: any) {
      if (axios.isCancel(error)) return [];

      if (isAxiosNetworkError(error))
        throw new HandledError(
          'Request aborted because of a network issue (timeout or similar).'
        );

      if ('issues' in error) {
        const err: ZodError = error;
        throw new Error(
          err.issues.map(e => `${e.path.join(' ')} ${e.message}`).join(' ')
        );
      }

      throw error;
    }
  }

  private async fetchRemoteMedia(): Promise<any[]> {
    const url = `${this.remote.url}/index.php/services/rest/location-media`;

    const token = await userModel.getAccessToken();

    const options = {
      params: {},
      headers: { Authorization: `Bearer ${token}` },
      timeout: 80000,
    };

    try {
      const res = await axios.get(url, options);

      const getValues = (doc: any) =>
        mapKeys(doc.values, (_, key) =>
          key.includes(':') ? key : camelCase(key)
        );

      const docs = res.data.map(getValues).map((doc: any) => ({
        id: doc.id,
        cid: doc.id,
        createdAt: new Date(doc.createdOn).getTime(),
        updatedAt: new Date(doc.updatedOn).getTime(),
        syncedAt: Date.now(),
        data: {
          type: 'jpeg',
          data: `${this.remote.url}/upload/${doc.path}`,
        },
        parentId: doc.locationId,
        metadata: {},
      }));

      return docs;
    } catch (error: any) {
      if (axios.isCancel(error)) return [];

      if (isAxiosNetworkError(error))
        throw new HandledError(
          'Request aborted because of a network issue (timeout or similar).'
        );

      if ('issues' in error) {
        const err: ZodError = error;
        throw new Error(
          err.issues.map(e => `${e.path.join(' ')} ${e.message}`).join(' ')
        );
      }

      throw error;
    }
  }

  private async removeStaleLocalModels(models: Location[], type: LocType[]) {
    const newExternalKeys = new Set(models.map(m => m.cid));

    // remove stale non-draft models that are no longer in the remote
    const stale = this.filter(model => {
      if (!type.includes(model.data.locationTypeId as any)) return false;

      const isLocalDuplicate = !model.id && newExternalKeys.has(model.cid); // can happen if uploaded but not reflected back in the app
      const modelIsStale = model.id && !newExternalKeys.has(model.cid); // once uploaded, but deleted from remote
      return modelIsStale || isLocalDuplicate;
    });
    await Promise.all(stale.map(m => m.destroy()));
  }
}

const collection = new LocationsCollection<Location>({
  store: locationsStore,
  Model: Location,
  url: config.backend.indicia.url,
  getAccessToken: () => userModel.getAccessToken(),
});

// (window as any).locationsCollection = collection;

export default collection;
