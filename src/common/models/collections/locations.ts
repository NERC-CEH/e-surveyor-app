import { reaction } from 'mobx';
import axios from 'axios';
import { camelCase } from 'lodash';
import { z, ZodError } from 'zod';
import {
  device,
  HandledError,
  isAxiosNetworkError,
  LocationCollection as LocationCollectionBase,
  LocationType,
  type LocationOptions,
} from '@flumens';
import type { Options as LocationCollectionOptions } from '@flumens/models/dist/Indicia/LocationCollection';
import config from 'common/config';
import Location, { dtoSchema, type Data, type Metadata } from 'models/location';
import userModel from 'models/user';
import { locationsStore } from '../store';

const responseSchema = z.array(
  z.object({ values: z.record(z.string(), z.unknown()) })
);
type LocationDTO = z.infer<typeof dtoSchema>;
type MediaDTO = {
  id: string;
  cid: string;
  createdAt: number;
  updatedAt: number;
  syncedAt: number;
  data: { type: string; data: string };
  parentId: string;
  metadata: Record<string, never>;
};
type StoredLocation = Omit<
  LocationOptions<Data, Metadata>,
  'data' | 'metadata' | 'media'
> & {
  data: {
    data: Data;
    metadata: Metadata;
    media: Record<string, unknown>[];
  };
};

const camelCaseValues = ({ values }: { values: Record<string, unknown> }) =>
  Object.fromEntries(
    Object.entries(values).map(([key, value]) => [
      key.includes(':') ? key : camelCase(key),
      value,
    ])
  );

const rawValue = (value: unknown) =>
  value && typeof value === 'object' && 'raw_value' in value
    ? value.raw_value
    : value;

class LocationsCollection extends LocationCollectionBase<Location> {
  constructor(options: LocationCollectionOptions<Location>) {
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

    const onLoginChange = async (newEmail?: string) => {
      if (!newEmail) return;

      await this.ready;
      console.log(`📚 Collection: ${this.id} collection email has changed`);
      fetchFirstTime();
    };
    reaction(() => userModel.data.email, onLoginChange);
  }

  async fetch() {
    if (!this.store) {
      this.ready.resolve(false);
      return;
    }

    const modelsJSON = (await this.store.findAll()) as StoredLocation[];
    const models = modelsJSON.map(json => {
      const { data, metadata, media } = json.data;
      return new Location({ ...json, data, metadata, media });
    });
    this.data.push(...models);
    this.ready.resolve(true);
  }

  async fetchRemote() {
    console.log(`📚 Collection: ${this.id} fetching`);
    this.remote.synchronising = true;

    try {
      const docs = await this.fetchRemoteByType(LocationType.Site);
      const mediaDocs = await this.fetchRemoteMedia();
      const newModels = docs.map(doc => {
        const media = mediaDocs.filter(({ parentId }) => parentId === doc.id);
        return Location.fromDTO(doc, { media }) as Location;
      });

      this.upsert(...newModels);
      await Promise.all(newModels.map(model => model.save()));
      await this.removeStaleLocalModels(newModels, [LocationType.Site]);
    } finally {
      this.remote.synchronising = false;
    }

    console.log(`📚 Collection: ${this.id} collection fetching done`);
  }

  private async fetchRemoteByType(
    locationTypeId: number | string,
    publicLocations = false
  ): Promise<LocationDTO[]> {
    const url = `${this.remote.url}/index.php/services/rest/locations`;
    const token = await userModel.getAccessToken();

    /* eslint-disable @typescript-eslint/naming-convention */
    const options = {
      params: {
        location_type_id: locationTypeId,
        public: publicLocations,
        verbose: 1,
      },
      headers: { Authorization: `Bearer ${token}` },
      timeout: 80000,
    };
    /* eslint-enable @typescript-eslint/naming-convention */

    try {
      const { data } = await axios.get<unknown>(url, options);
      return responseSchema
        .parse(data)
        .map(camelCaseValues)
        .map(doc => {
          const normalizeValue = ([key, value]: [string, unknown]) => {
            if (!key.includes('locAttr:')) return [key, value];
            return [
              key,
              Array.isArray(value) ? value.map(rawValue) : rawValue(value),
            ];
          };
          const values = Object.fromEntries(
            Object.entries(doc).map(normalizeValue)
          );
          return dtoSchema.loose().parse(values);
        });
    } catch (error) {
      if (axios.isCancel(error)) return [];
      if (axios.isAxiosError(error) && isAxiosNetworkError(error))
        throw new HandledError(
          'Request aborted because of a network issue (timeout or similar).'
        );
      if (error instanceof ZodError)
        throw new Error(
          error.issues.map(e => `${e.path.join(' ')} ${e.message}`).join(' ')
        );
      throw error;
    }
  }

  private async fetchRemoteMedia(): Promise<MediaDTO[]> {
    const url = `${this.remote.url}/index.php/services/rest/location-media`;
    const token = await userModel.getAccessToken();
    const options = {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 80000,
    };

    try {
      const { data } = await axios.get<unknown>(url, options);
      return responseSchema
        .parse(data)
        .map(camelCaseValues)
        .map(doc => ({
          id: String(doc.id),
          cid: String(doc.id),
          createdAt: new Date(String(doc.createdOn)).getTime(),
          updatedAt: new Date(String(doc.updatedOn)).getTime(),
          syncedAt: Date.now(),
          data: {
            type: 'jpeg',
            data: `${this.remote.url}/upload/${String(doc.path)}`,
          },
          parentId: String(doc.locationId),
          metadata: {},
        }));
    } catch (error) {
      if (axios.isCancel(error)) return [];
      if (axios.isAxiosError(error) && isAxiosNetworkError(error))
        throw new HandledError(
          'Request aborted because of a network issue (timeout or similar).'
        );
      if (error instanceof ZodError)
        throw new Error(
          error.issues.map(e => `${e.path.join(' ')} ${e.message}`).join(' ')
        );
      throw error;
    }
  }

  private async removeStaleLocalModels(
    models: Location[],
    types: LocationType[]
  ) {
    const newExternalKeys = new Set(models.map(model => model.cid));
    const stale = this.filter(model => {
      if (
        !types.some(type => Number(type) === Number(model.data.locationTypeId))
      )
        return false;

      const isLocalDuplicate = !model.id && newExternalKeys.has(model.cid);
      const modelIsStale = !!model.id && !newExternalKeys.has(model.cid);
      return modelIsStale || isLocalDuplicate;
    });
    await Promise.all(stale.map(model => model.destroy()));
  }
}

const collection = new LocationsCollection({
  store: locationsStore,
  Model: Location,
  url: config.backend.indicia.url,
  getAccessToken: () => userModel.getAccessToken(),
});

export default collection;
