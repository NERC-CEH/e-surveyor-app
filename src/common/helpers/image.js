import { device } from '@apps';
import Indicia from '@indicia-js/core';
import Log from './log';

export function _onGetImageError(err, resolve, reject) {
  if (typeof err !== 'string') {
    // for some reason the plugin's errors can be non-strings
    err = ''; //eslint-disable-line
  }

  const e = err.toLowerCase();
  if (
    e.includes('has no access') ||
    e.includes('cancelled') ||
    e.includes('selected')
  ) {
    resolve(); // no image selected
    return;
  }
  reject(err);
}

const Image = {
  /**
   * Gets a fileEntry of the selected image from the camera or gallery.
   * If none selected then fileEntry is empty.
   * @param options
   * @returns {Promise}
   */
  getImage(options = {}) {
    const promiseCallback = (resolve, reject) => {
      Log('Helpers:Image: getting.');

      const defaultCameraOptions = {
        sourceType: window.Camera.PictureSourceType.CAMERA,
        // allow edit is unpredictable on Android and it should not be used!
        allowEdit: false,
        quality: 40,
        targetWidth: 1000,
        targetHeight: 1000,
        destinationType: window.Camera.DestinationType.FILE_URI,
        encodingType: window.Camera.EncodingType.JPEG,
        saveToPhotoAlbum: true,
        correctOrientation: true,
      };

      const cameraOptions = { ...{}, ...defaultCameraOptions, ...options };

      if (device.isAndroid()) {
        // Android bug:
        // https://issues.apache.org/jira/browse/CB-12270
        delete cameraOptions.saveToPhotoAlbum;
      }

      function copyFileToAppStorage(fileURI) {
        let URI = fileURI;
        function onSuccessCopyFile(fileEntry) {
          const name = `${Date.now()}.jpeg`;

          const copyToDataDirectory = fileSystem => {
            fileEntry.copyTo(fileSystem, name, resolve, reject);
          };

          window.resolveLocalFileSystemURL(
            // eslint-disable-next-line no-undef
            cordova.file.dataDirectory,
            copyToDataDirectory,
            reject
          );
        }

        // for some reason when selecting from Android gallery
        // the prefix is sometimes missing
        if (
          device.isAndroid() &&
          options.sourceType === window.Camera.PictureSourceType.PHOTOLIBRARY
        ) {
          if (!/file:\/\//.test(URI)) {
            URI = `file://${URI}`;
          }
        }

        window.resolveLocalFileSystemURL(URI, onSuccessCopyFile, reject);
      }

      function onSuccess(fileURI) {
        if (
          device.isAndroid() &&
          cameraOptions.sourceType === window.Camera.PictureSourceType.CAMERA
        ) {
          const copyFileToAppStorageWrap = () => copyFileToAppStorage(fileURI);

          // Android bug:
          // https://issues.apache.org/jira/browse/CB-12270
          window.cordova.plugins.imagesaver.saveImageToGallery(
            fileURI,
            copyFileToAppStorageWrap,
            reject
          );
          return;
        }

        copyFileToAppStorage(fileURI);
      }

      const onErr = err => _onGetImageError(err, resolve, reject);
      navigator.camera.getPicture(onSuccess, onErr, cameraOptions);
    };

    return new Promise(promiseCallback);
  },

  /**
   * Create new record with a photo
   */
  getImageModel(ImageModel, file) {
    if (!file) {
      const err = new Error('File not found while creating image model.');
      return Promise.reject(err);
    }

    // create and add new record
    const success = args => {
      const [data, type, width, height] = args;
      const imageModel = new ImageModel({
        attrs: {
          data,
          type,
          width,
          height,
        },
      });

      return imageModel.addThumbnail().then(() => imageModel);
    };

    const isBrowser = !window.cordova && file instanceof File;
    if (isBrowser) {
      return Indicia.Media.getDataURI(file, { width: 1000, height: 1000 }).then(
        success
      );
    }

    file = window.Ionic.WebView.convertFileSrc(file); // eslint-disable-line
    const result = args => {
      // don't resize, only get width and height
      const [, , width, height] = args;
      const fileName = file.split('/').pop();
      return success([fileName, 'jpeg', width, height]);
    };
    return Indicia.Media.getDataURI(file).then(result);
  },

  validateRemote() {
    // nothing to validate yet
  },
};

export { Image as default };
