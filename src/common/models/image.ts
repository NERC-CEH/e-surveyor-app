import { Capacitor } from '@capacitor/core';
import {
  Filesystem,
  Directory as FilesystemDirectory,
} from '@capacitor/filesystem';
import {
  Media as MediaOriginal,
  MediaAttrs,
  type MediaOptions,
  isDataURL,
} from '@flumens';
import { isPlatform } from '@ionic/react';
import config from 'common/config';
import type Location from './location';
import Occurrence, { type Taxon } from './occurrence';
import Sample from './sample';
import userModel from './user';

type Data = MediaAttrs & {
  identified?: boolean;
  species?: Taxon | null;
};

export default class Media extends MediaOriginal<Data> {
  static getImageModel(image: string) {
    let convertedImage = image;

    if (isPlatform('hybrid') && !isDataURL(image)) {
      convertedImage = Capacitor.convertFileSrc(image);
    }

    return MediaOriginal.getImageModel.call(
      Media,
      convertedImage,
      config.dataPath,
      true
    ) as Promise<Media>;
  }

  declare parent?: MediaOriginal<Data>['parent'] &
    (Sample | Occurrence | Location);

  constructor(options: MediaOptions<Data> = {}) {
    super({
      ...options,
      url: config.backend.indicia.url,
      getAccessToken: () => userModel.getAccessToken(),
    });

    if (!Object.hasOwn(this.data, 'identified')) {
      this.data.identified = false;
    }
  }

  async destroy() {
    console.log('MediaModel: destroying.');

    // remove from internal storage
    if (!isPlatform('hybrid') || window.testing) {
      if (!this.parent) return;

      this.parent.media.remove(this);

      if (!this.isPersistent()) return;

      this.parent.save();
    }

    try {
      if (this.data.path) {
        // backwards compatible - don't delete old media
        await Filesystem.deleteFile({
          path: String(this.data.data),
          directory: FilesystemDirectory.Data,
        });
      }

      if (!this.parent) return;

      this.parent.media.remove(this);

      if (!this.isPersistent()) return;

      this.parent.save();
    } catch (err) {
      console.error(err);
    }
  }

  getURL(): string {
    const name = String(this.data.data || '');

    if (
      !isPlatform('hybrid') ||
      process.env.NODE_ENV === 'test' ||
      name.includes('http')
    ) {
      return name;
    }

    return Capacitor.convertFileSrc(`${config.dataPath}/${name}`);
  }

  validateRemote = () => null;

  isPersistent() {
    return this.parent?.isPersistent();
  }

  async save() {
    if (!this.parent) {
      return Promise.reject(
        new Error('Trying to save locally without a parent')
      );
    }

    return this.parent.save();
  }
}
