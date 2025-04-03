import { isPlatform } from '@ionic/react';

/**
 * Converts DataURI object to a Blob.
 *
 * @param {type} dataURI
 * @param {type} fileType
 * @returns {undefined}
 */
function dataURItoBlob(dataURI: any, fileType: any) {
  const binary = atob(dataURI.split(',')[1]);
  const array = [];
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], {
    type: fileType,
  });
}

function URLtoBlob(url: any) {
  const cb = (resolve: any) => {
    const xhr = new XMLHttpRequest();

    xhr.onload = function onLoad() {
      resolve(xhr.response);
    };

    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  };

  return new Promise(cb);
}

function getBlobFromURL(uri: any, mediaType: any) {
  if (!isPlatform('hybrid')) {
    const blob = dataURItoBlob(uri, mediaType);
    return Promise.resolve(blob);
  }

  return URLtoBlob(uri);
}

export default async function appendModelToFormData(
  mediaModel: any,
  formData: any,
  key = 'images'
) {
  // can provide both image/jpeg and jpeg
  const { type } = mediaModel.attrs;
  let extension = type;
  let mediaType = type;
  if (type.match(/image.*/)) {
    [, extension] = type.split('/');
  } else {
    mediaType = `image/${mediaType}`;
  }

  const url = mediaModel.getURL();

  const blob = await getBlobFromURL(url, mediaType);

  const name = mediaModel.cid;

  formData.append(key, blob, `${name}.${extension}`);
}
