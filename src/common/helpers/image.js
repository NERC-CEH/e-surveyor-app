import Indicia from '@indicia-js/core';
import {
  Plugins,
  CameraResultType,
  FilesystemDirectory,
} from '@capacitor/core';
import { isPlatform } from '@ionic/react';

const { Camera, Filesystem } = Plugins;

async function getImageMeta(url) {
  // eslint-disable-next-line
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const res = () => resolve(img);
    const rej = () => reject();
    img.onload = res;
    img.onerror = rej;
    img.src = url;
  });
}

const Image = {
  /**
   * Gets a fileEntry of the selected image from the camera or gallery.
   * If none selected then fileEntry is empty.
   * @param options
   * @returns {Promise}
   */
  async getImage(options = {}) {
    const defaultCameraOptions = {
      quality: 40,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      saveToGallery: true,
      correctOrientation: true,
      promptLabelHeader: 'Choose a method to upload a photo',
      promptLabelPhoto: 'Gallery',
      promptLabelPicture: 'Camera',
      promptLabelCancel: 'Cancel',
    };

    const cameraOptions = { ...{}, ...defaultCameraOptions, ...options };

    const file = await Camera.getPhoto(cameraOptions);
    const name = `${Date.now()}.jpeg`;

    // This example copies a file within the documents directory
    await Filesystem.copy({
      from: file.path,
      to: name,
      toDirectory: FilesystemDirectory.Data,
    });

    const { uri } = await Filesystem.stat({
      path: name,
      directory: FilesystemDirectory.Data,
    });

    return uri;
  },

  async getImageModel(ImageModel, imageURL, dataDirPath) {
    if (!imageURL) {
      throw new Error('File not found while creating image model.');
    }

    let width;
    let height;
    let data;
    let type;

    if (isPlatform('hybrid')) {
      imageURL = Capacitor.convertFileSrc(imageURL); // eslint-disable-line
      const imageMetaData = await getImageMeta(imageURL);

      width = imageMetaData.width;
      height = imageMetaData.height;
      data = imageURL.split('/').pop();
    } else {
      [data, type, width, height] = await Indicia.Media.getDataURI(imageURL);
    }

    const imageModel = new ImageModel({
      attrs: {
        data,
        type,
        width,
        height,
        path: dataDirPath,
      },
    });

    await imageModel.addThumbnail();

    return imageModel;
  },
};

export { Image as default };
