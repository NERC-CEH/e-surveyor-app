import { Media } from '@flumens';
import Log from 'helpers/log';
import { observable } from 'mobx';
import { isPlatform } from '@ionic/react';
import { Capacitor } from '@capacitor/core';
import {
  Filesystem,
  Directory as FilesystemDirectory,
} from '@capacitor/filesystem';
import identifyImage from 'common/services/plantNet';

export default class AppMedia extends Media {
  @observable identification = { identifying: false };

  constructor(...args) {
    super(...args);

    this.attrs = observable({
      species: null,
      ...this.attrs,
    });
  }

  async destroy(silent) {
    Log('MediaModel: destroying.');

    // remove from internal storage
    if (!isPlatform('hybrid') || window.testing) {
      if (!this.parent) {
        return null;
      }

      this.parent.media.remove(this);

      if (silent) {
        return null;
      }

      return this.parent.save();
    }

    const URL = this.attrs.data;

    try {
      if (this.attrs.path) {
        // backwards compatible - don't delete old media
        await Filesystem.deleteFile({
          path: URL,
          directory: FilesystemDirectory.Data,
        });
      }

      if (!this.parent) {
        return null;
      }

      this.parent.media.remove(this);

      if (silent) {
        return null;
      }

      return this.parent.save();
    } catch (err) {
      Log(err, 'e');
    }

    return null;
  }

  getURL() {
    const { data: name, path } = this.attrs;

    if (!isPlatform('hybrid') || process.env.NODE_ENV === 'test') {
      return name;
    }

    return Capacitor.convertFileSrc(`${path}/${name}`);
  }

  async identify() {
    this.identification.identifying = true;

    const species = await identifyImage(this);
    const byScore = (sp1, sp2) => sp2.score - sp1.score;
    species.sort(byScore);

    this.attrs.species = species;
    this.identification.identifying = false;

    return species[0];
  }

  isIdentifying() {
    return this.identification.identifying;
  }

  // eslint-disable-next-line class-methods-use-this
  validateRemote() {
    return null;
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
