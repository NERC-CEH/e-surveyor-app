import { DataURI, ObjectURL, URL } from './index';

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
  return window.URL.createObjectURL(blob);
}

export const createImage = (
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

export function resize({
  url,
  fileType = 'image/jpeg',
  MAX_WIDTH = 1000,
  MAX_HEIGHT = 1000,
}: {
  url: URL;
  fileType?: string;
  MAX_WIDTH?: number;
  MAX_HEIGHT?: number;
}): Promise<[HTMLImageElement, DataURI]> {
  const promise = new Promise<[HTMLImageElement, DataURI]>(fulfill => {
    const image = new window.Image(); // native one

    image.onload = () => {
      let { width } = image;
      let { height } = image;

      const maxWidth = MAX_WIDTH || width;
      const maxHeight = MAX_HEIGHT || height;

      let res = null;

      // resizing
      if (width > height) {
        res = width / maxWidth;
      } else {
        res = height / maxHeight;
      }

      width /= res;
      height /= res;

      // Create a canvas with the desired dimensions
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      // Scale and draw the source image to the canvas
      canvas.getContext('2d')?.drawImage(image, 0, 0, width, height);

      // Convert the canvas to a data URL in some format
      fulfill([image, canvas.toDataURL(fileType)]);
    };

    image.src = url;
  });

  return promise;
}
