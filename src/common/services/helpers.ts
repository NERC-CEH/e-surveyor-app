import { isPlatform } from '@ionic/react';
import blackListedData from 'common/data/cacheRemote/uksi_plants_blacklist.json';
import { Suggestion } from 'models/occurrence';

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

const blacklisted = blackListedData.map(sp => sp.taxon);

export function filterUKSpecies(results: Suggestion[]) {
  let removedSpeciesScores = 0;

  const isUKSpeciesOrHighScore = (result: Suggestion) => {
    const highScore = result.score >= 0.9;
    const ukSpecies = result.warehouseId;
    if (ukSpecies || highScore) return true;

    removedSpeciesScores += result.score;

    return false;
  };

  const blacklistedUKSpecies = (result: Suggestion) =>
    !blacklisted.includes(result.scientificName);

  const changeScoreValue = (sp: Suggestion) => {
    const newScore = sp.score / (1 - removedSpeciesScores);

    return { ...sp, score: newScore };
  };

  return results
    .filter(isUKSpeciesOrHighScore)
    .filter(blacklistedUKSpecies)
    .map(changeScoreValue);
}
