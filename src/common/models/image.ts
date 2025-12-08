import { observable } from 'mobx';
import { Capacitor } from '@capacitor/core';
import {
  Filesystem,
  Directory as FilesystemDirectory,
} from '@capacitor/filesystem';
import { Media as MediaOriginal, MediaAttrs } from '@flumens';
import { isPlatform } from '@ionic/react';
import config from 'common/config';
import Occurrence from './occurrence';
import Sample from './sample';
import userModel from './user';

export type URL = string;

type Data = MediaAttrs & { identified?: boolean; species: any };

export default class Media extends MediaOriginal<Data> {
  declare parent?: Sample | Occurrence;

  identification = observable({ identifying: false });

  constructor(options: any) {
    super({
      ...options,
      url: config.backend.indicia.url,
      getAccessToken: () => userModel.getAccessToken(),
    });

    if (!Object.prototype.hasOwnProperty.call(this.data, 'identified')) {
      this.data.identified = false;
    }
  }

  async destroy() {
    console.log('MediaModel: destroying.');

    // remove from internal storage
    if (!isPlatform('hybrid') || (window as any).testing) {
      if (!this.parent) return;

      this.parent.media.remove(this);

      if (!this.isPersistent()) return;

      this.parent.save();
    }

    try {
      if (this.data.path) {
        // backwards compatible - don't delete old media
        await Filesystem.deleteFile({
          path: this.data.data,
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

  getURL() {
    const { data: name } = this.data;

    if (!isPlatform('hybrid') || process.env.NODE_ENV === 'test') {
      return name;
    }

    return Capacitor.convertFileSrc(`${config.dataPath}/${name}`);
  }

  // eslint-disable-next-line class-methods-use-this
  validateRemote = () => null;

  isPersistent() {
    return this.parent && this.parent?.isPersistent();
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
