import { Media } from '@flumens';
import { observable } from 'mobx';
import { isPlatform } from '@ionic/react';
import { Capacitor } from '@capacitor/core';
import {
  Filesystem,
  Directory as FilesystemDirectory,
} from '@capacitor/filesystem';
import identifyImage from 'common/services/plantNet';

export default class AppMedia extends Media {
  identification = observable({ identifying: false });

  constructor(...args) {
    super(...args);

    this.attrs = observable({
      species: null,
      ...this.attrs,
    });
  }

  async destroy(silent) {
    console.log('MediaModel: destroying.');

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
      console.error(err);
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
    try {
      this.identification.identifying = true;

      const species = await identifyImage(this);

      const byScore = (sp1, sp2) => sp2.score - sp1.score;
      species.sort(byScore);

      this.attrs.species = species;

      const isPartOfSurvey = this.parent;
      if (isPartOfSurvey) this.save();

      this.identification.identifying = false;
    } catch (error) {
      this.identification.identifying = false;
      throw error;
    }

    return this.attrs.species?.[0];
  }

  isIdentifying = () => this.identification.identifying;

  // eslint-disable-next-line class-methods-use-this
  validateRemote = () => null;

  async save() {
    if (!this.parent) {
      return Promise.reject(
        new Error('Trying to save locally without a parent')
      );
    }

    return this.parent.save();
  }
}
