import { LocationCollection as LocationCollectionBase } from '@flumens';
import config from 'common/config';
import Location from 'models/location';
import userModel from 'models/user';
import { locationsStore } from '../store';

export class LocationsCollection<
  T extends Location = Location,
> extends LocationCollectionBase<T> {
  async fetch() {
    if (!this.store || !this.Model) {
      this.ready.resolve(false);
      return;
    }

    const modelsJSON = await this.store.findAll();

    const getModel = (json: any) => {
      const { data, metadata, media } = json.data;
      return new (this.Model as any)({
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
}

const collection = new LocationsCollection<Location>({
  store: locationsStore,
  Model: Location,
  url: config.backend.indicia.url,
  getAccessToken: () => userModel.getAccessToken(),
});

export default collection;
