import { observable } from 'mobx';
import { Capacitor } from '@capacitor/core';
import {
  Filesystem,
  Directory as FilesystemDirectory,
} from '@capacitor/filesystem';
import { Media as MediaOriginal, MediaAttrs, createImage } from '@flumens';
import { isPlatform } from '@ionic/react';
import config from 'common/config';
import Occurrence from './occurrence';
import Sample from './sample';

export type URL = string;

type Attrs = MediaAttrs & { identified?: boolean };

export default class Media extends MediaOriginal<Attrs> {
  declare parent?: Sample | Occurrence;

  /**
   * Create new image model with a photo
   * @param ImageModel Class representing the model.
   * @param imageURL
   * @param dataDirPath
   * @returns
   */
  static async getImageModel(
    imageURL: URL,
    dataDirPath: string
  ): Promise<Media> {
    if (!imageURL) {
      throw new Error('File not found while creating image model.');
    }

    let width;
    let height;
    let data;

    if (isPlatform('hybrid')) {
      imageURL = Capacitor.convertFileSrc(imageURL); // eslint-disable-line
      const image = await createImage(imageURL);

      width = image.width;
      height = image.height;

      data = imageURL.split('/').pop();
    } else {
      [data, , width, height] = await Media.getDataURI(imageURL, {
        width: 1000,
        height: 1000,
      });
    }

    const imageModel: Media = new Media({
      attrs: {
        data,
        type: 'jpeg',
        width,
        height,
        path: dataDirPath,
      },
    });

    await imageModel.addThumbnail();

    return imageModel;
  }

  attrs: Attrs = observable({
    identified: false,
    ...this.attrs,
  });

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
      if (this.attrs.path) {
        // backwards compatible - don't delete old media
        await Filesystem.deleteFile({
          path: this.attrs.data,
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
    const { data: name } = this.attrs;

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
