import config from 'common/config';
import { isPlatform } from '@ionic/react';
import UKSIPlants from '../data/uksi_plants.list.json';
import UKPlantNames from '../data/uksi_plants.names.json';
import PlantNetResponse, { Result } from './plantNetResponse.d';

type ResultWithWarehouseID = Result & { warehouseId: number };

const { backend } = config;

/**
 * Converts DataURI object to a Blob.
 *
 * @param {type} dataURI
 * @param {type} fileType
 * @returns {undefined}
 */
export function dataURItoBlob(dataURI: any, fileType: any) {
  const binary = atob(dataURI.split(',')[1]);
  const array = [];
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], {
    type: fileType,
  });
}

export function URLtoBlob(url: any) {
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

export function getBlobFromURL(uri: any, mediaType: any) {
  if (!isPlatform('hybrid')) {
    const blob = dataURItoBlob(uri, mediaType);
    return Promise.resolve(blob);
  }

  return URLtoBlob(uri);
}

async function appendModelToFormData(mediaModel: any, formData: any) {
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

  formData.append('images', blob, `${name}.${extension}`);
}

const addWarehouseId = (sp: Result): ResultWithWarehouseID => {
  return {
    ...sp,
    warehouseId: (UKSIPlants as any)[sp.species.scientificNameWithoutAuthor],
  };
};

const addUKSIId = (results: Result[]) => results.map(addWarehouseId);

function filterUKSpeciesWrap(results: ResultWithWarehouseID[]) {
  let removedSpeciesScores = 0;

  const filterByUKSpecies = (result: ResultWithWarehouseID) => {
    if (result.warehouseId || result.score >= 0.9) return true;

    removedSpeciesScores += result.score;

    return false;
  };

  const changeScoreValue = (sp: ResultWithWarehouseID) => {
    const newScore = sp.score / (1 - removedSpeciesScores);

    return { ...sp, score: newScore };
  };

  const filteredSpecies = results
    .filter(filterByUKSpecies)
    .map(changeScoreValue);

  return filteredSpecies;
}

function changeUKCommonNamesWrap(results: ResultWithWarehouseID[]) {
  const changeUKCommonNames = ({ species }: ResultWithWarehouseID) => {
    const { scientificNameWithoutAuthor } = species;
    const speciesUKName = (UKPlantNames as any)[scientificNameWithoutAuthor];
    species.commonNames = !speciesUKName ? [] : [speciesUKName]; // eslint-disable-line
  };

  results.forEach(changeUKCommonNames);

  return results;
}

const response = (res: any) => res.json();

const checkValidResponse = (res: any) => {
  if (res.error) throw new Error(res.error);

  return res;
};

const getResults = ({ results }: PlantNetResponse) => results;

const err = (error: any) => {
  if (error.message === 'Not Found') {
    return []; // always empty list
  }

  console.error(error);

  throw new Error(
    'For some reason we could not identify the species at the moment. Please try again later.'
  );
};

// TODO: use axios
export default async function identify(image: any) {
  const formData = new FormData();

  formData.append('organs', 'leaf');
  await appendModelToFormData(image, formData);

  return fetch(`${backend.url}/api/plantnet`, {
    method: 'post',
    body: formData,
  })
    .then(response)
    .then(checkValidResponse)
    .then(getResults)
    .then(addUKSIId)
    .then(filterUKSpeciesWrap)
    .then(changeUKCommonNamesWrap)
    .catch(err);
}
