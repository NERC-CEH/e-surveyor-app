import {
  Camera,
  CameraResultType,
  GalleryPhoto,
  ImageOptions as ImageOptionsOriginal,
  GalleryImageOptions,
  CameraSource,
} from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { createImage, resize } from './helpers';

export * from './helpers';

export type URL = string;

export type ObjectURL = string;

export type DataURI = string;

type Area = {
  width: number;
  height: number;
  x: number;
  y: number;
};

/**
 * Crops an image.
 * @param imageURL
 * @param crop
 * @returns
 */
export async function cropImage(imageURL: URL, crop: Area): Promise<DataURI> {
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

type Options = Partial<ImageOptionsOriginal> & {
  camera?: boolean;
  multiple?: boolean;
  getPhoto?: () => Promise<GalleryPhoto | null>;
};

async function resizeImageAndSaveLocally(filePath: URL): Promise<URL> {
  const fileName = `${Date.now()}.jpeg`;

  const [, imageDataURL] = await resize({
    url: Capacitor.convertFileSrc(filePath),
  });

  await Filesystem.writeFile({
    path: fileName,
    data: imageDataURL,
    directory: Directory.Data,
  });

  const { uri } = await Filesystem.stat({
    path: fileName,
    directory: Directory.Data,
  });

  return uri;
}

async function getPhotos(options: Options): Promise<GalleryPhoto[]> {
  const { camera, multiple, getPhoto, ...restOptions } = options;

  try {
    if (getPhoto) {
      const photo = await getPhoto();
      return photo ? [photo] : [];
    }
  } catch (e) {
    console.error(e);
    throw e;
  }

  if (multiple) {
    try {
      const galleryOptions: GalleryImageOptions = {
        quality: 40,
        correctOrientation: true,
        limit: 30,
        ...restOptions,
      };
      const result = await Camera.pickImages(galleryOptions);
      return result.photos;
    } catch (_) {
      // user canceled the action or permissions issue
      return [];
    }
  }

  try {
    const cameraOptions = {
      quality: 40,
      allowEditing: false,
      saveToGallery: true,
      webUseInput: true,
      correctOrientation: true,
      resultType: CameraResultType.Uri,
      source: camera ? CameraSource.Camera : CameraSource.Photos,
      ...restOptions,
    };

    const photo = await Camera.getPhoto(cameraOptions);
    return [photo as GalleryPhoto];
  } catch (_) {
    // user canceled the action or permissions issue
    return [];
  }
}

/**
 * Gets a URL of the selected image from the camera or gallery.
 * If none selected then URL is empty.
 */
export default async function captureImage(
  options: Options = {}
): Promise<URL[]> {
  const photos: GalleryPhoto[] = await getPhotos(options);

  const uris = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const photo of photos) {
    if (!photo.path) {
      // web
      if (photo.webPath) uris.push(photo.webPath);
      // eslint-disable-next-line no-continue
      continue;
    }

    // eslint-disable-next-line no-await-in-loop
    const uri = await resizeImageAndSaveLocally(photo.path);

    uris.push(uri);
  }

  return uris;
}
