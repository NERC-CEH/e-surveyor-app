import { isPlatform } from '@ionic/react';
import {
  Camera,
  CameraResultType,
  GalleryPhoto,
  ImageOptions as ImageOptionsOriginal,
  Photo,
} from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { CameraPreview } from '@capacitor-community/camera-preview';
import { Capacitor } from '@capacitor/core';

type ImageOptions = Partial<ImageOptionsOriginal>;

type Model = any;

export type URL = string;

export type ObjectURL = string;

export type DataURI = string;

type Area = {
  width: number;
  height: number;
  x: number;
  y: number;
};

const createImage = (
  url: URL | DataURI | ObjectURL
): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new window.Image();
    const res = () => resolve(img);
    const rej = (err: string | Event) => reject(err);
    img.onload = res;
    img.onerror = rej;
    img.src = url;
  });

/**
 * Create an object URL from dataURI.
 */
export function getObjectURL(dataURI: DataURI): ObjectURL {
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const data = window.atob(dataURI.split(',')[1]);
  const array = [];
  for (let i = 0; i < data.length; i++) {
    array.push(data.charCodeAt(i));
  }
  const blob = new Blob([new Uint8Array(array)], { type: mimeString });
  return URL.createObjectURL(blob);
}

/**
 * Uses Camera Preview plugin to pick an image using the camera.
 */
async function getPhotoFromPreview(): Promise<GalleryPhoto | null> {
  return new Promise(resolve => {
    const container = document.createElement('div');
    container.setAttribute('id', 'camera-container');
    document.body.appendChild(container);

    const root = document.getElementById('root');
    root?.setAttribute('style', 'display:none');

    const cameraFocusFrame = document.createElement('div');
    cameraFocusFrame.setAttribute('id', 'camera-focus-frame');
    container.appendChild(cameraFocusFrame);

    const cameraButton = document.createElement('button');
    cameraButton.classList.add('camera-button');

    async function cleanUp() {
      await CameraPreview.stop();
      document.body.removeChild(container);

      root?.removeAttribute('style');

      // cameraButton.removeEventListener('click', takePhoto);
      // cancelButton.removeEventListener('click', cleanUp);
    }

    const takePhoto = async () => {
      const cameraPreviewPictureOptions = {
        quality: 50,
      };

      const result = await CameraPreview.capture(cameraPreviewPictureOptions);

      const path = isPlatform('hybrid') ? result.value : '';
      const webPath = !isPlatform('hybrid')
        ? getObjectURL(`data:image/png;base64,${result.value}`)
        : '';

      // TODO: save to file

      cleanUp();
      resolve({ webPath, path, format: 'jpeg' });
    };
    cameraButton.addEventListener('click', takePhoto);
    container.appendChild(cameraButton);

    const cancelCamera = async () => {
      cleanUp();
      resolve(null);
    };
    const cancelButton = document.createElement('button');
    cancelButton.classList.add('cancel-button');
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', cancelCamera);
    container.appendChild(cancelButton);

    (async () => {
      const cameraPreviewOptions = {
        position: 'rear',
        paddingBottom: 80,
        parent: 'camera-container',
        storeToFile: true,
        toBack: true,
        disableAudio: true,
        rotateWhenOrientationChanged: false,
      };
      await CameraPreview.start(cameraPreviewOptions);
      if (isPlatform('hybrid'))
        container?.setAttribute('style', 'background:none'); // make the camera visible
    })();
  });
}

/**
 * Gets a URL of the selected image from the camera or gallery.
 * If none selected then URL is empty.
 */
export async function getImage(options: ImageOptions = {}): Promise<URL> {
  try {
    let file: Photo;
    try {
      const cameraOptions = {
        quality: 40,
        allowEditing: false,
        saveToGallery: true,
        webUseInput: true,
        correctOrientation: true,
        resultType: CameraResultType.Uri,
        ...options,
      };
      file = await Camera.getPhoto(cameraOptions);
    } catch (_) {
      // user canceled the action or permissions issue
      return '';
    }

    if (!file.path) {
      // web
      if (file.webPath) return file.webPath;
      return '';
    }

    const name = `${Date.now()}.jpeg`;
    await Filesystem.copy({
      from: file.path,
      to: name,
      toDirectory: Directory.Data,
    });

    const { uri } = await Filesystem.stat({
      path: name,
      directory: Directory.Data,
    });

    return uri;
  } catch (e) {
    console.error(e);
  }

  return '';
}

/**
 * Gets multiple URLs of the selected images from the gallery or
 * a single photo from a camera with no confirmation.
 * If none selected then the result is empty array.
 */
export async function getImages(
  options: ImageOptions = {},
  presentActionSheet: any
): Promise<URL[]> {
  let files: GalleryPhoto[];
  try {
    const shouldUseGallery = await new Promise((resolve, reject) => {
      presentActionSheet({
        buttons: [
          { text: 'From Photos', handler: () => resolve(true) },
          { text: 'Take Picture', handler: () => resolve(false) },
          { text: 'Cancel', role: 'cancel', handler: () => reject() },
        ],
        header: 'Select image source',
      });
    });

    if (shouldUseGallery) {
      const galleryOptions = {
        quality: 40,
        allowEditing: false,
        saveToGallery: true,
        webUseInput: true,
        correctOrientation: true,
        resultType: CameraResultType.Uri,
        ...options,
      };
      const { photos } = await Camera.pickImages(galleryOptions);
      files = photos;
    } else {
      // camera
      const photo = await getPhotoFromPreview();
      files = photo ? [photo] : [];
    }
  } catch (e) {
    return [];
  }

  if (!isPlatform('hybrid')) {
    return files.map(({ webPath }) => webPath);
  }

  const uris = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const file of files) {
    // eslint-disable-next-line no-continue
    if (!file.path) continue;

    const name = `${Date.now()}.jpeg`;
    // eslint-disable-next-line no-await-in-loop
    await Filesystem.copy({
      from: file.path,
      to: name,
      toDirectory: Directory.Data,
    });

    // eslint-disable-next-line no-await-in-loop
    const { uri } = await Filesystem.stat({
      path: name,
      directory: Directory.Data,
    });

    uris.push(uri);
  }

  return uris;
}

/**
 * Create new image model with a photo
 * @param ImageModel Class representing the model.
 * @param imageURL
 * @param dataDirPath
 * @returns
 */
export async function getImageModel(
  ImageModel: any,
  imageURL: URL,
  dataDirPath: string
): Promise<Model> {
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
    [data, , width, height] = await ImageModel.getDataURI(imageURL, {
      width: 1000,
      height: 1000,
    });
  }

  const imageModel: Model = new ImageModel({
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

/**
 * Crops an image.
 * @param imageURL
 * @param crop
 * @returns
 */
export async function getCroppedImg(
  imageURL: URL,
  crop: Area
): Promise<DataURI> {
  const image = await createImage(imageURL);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) return '';

  /* setting canvas width & height allows us to 
  resize from the original image resolution */
  canvas.width = crop.width;
  canvas.height = crop.height;

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    canvas.width,
    canvas.height
  );

  return canvas.toDataURL();
}
