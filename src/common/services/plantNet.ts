/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import config from 'common/config';
import { isPlatform } from '@ionic/react';
import Image from 'models/image';
import UKSIPlantsData from '../data/uksi_plants.list.json';
import UKPlantNamesData from '../data/uksi_plants.names.json';
import blackListedData from '../data/cacheRemote/uksi_plants_blacklist.json';
import PlantNetResponse, { Result } from './plantNetResponse.d';

const UKSIPlants: { [key: string]: number } = UKSIPlantsData;
const UKPlantNames: { [key: string]: string } = UKPlantNamesData;

const blacklisted = blackListedData.map(sp => sp.taxon);

export type ResultWithWarehouseID = Result & { warehouseId: number };

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

  formData.append(`images`, blob, `${name}.${extension}`);
}

export const processResponse = async (
  res: Pick<PlantNetResponse, 'results'>
) => {
  const addWarehouseId = (sp: Result): ResultWithWarehouseID => ({
    ...sp,
    warehouseId: UKSIPlants[sp.species.scientificNameWithoutAuthor],
  });

  function filterUKSpecies(results: ResultWithWarehouseID[]) {
    let removedSpeciesScores = 0;

    const isUKSpeciesOrHighScore = (result: ResultWithWarehouseID) => {
      const highScore = result.score >= 0.9;
      const ukSpecies = result.warehouseId;
      if (ukSpecies || highScore) return true;

      removedSpeciesScores += result.score;

      return false;
    };

    const blacklistedUKSpecies = (result: ResultWithWarehouseID) =>
      !blacklisted.includes(result.species.scientificNameWithoutAuthor);

    const changeScoreValue = (sp: ResultWithWarehouseID) => {
      const newScore = sp.score / (1 - removedSpeciesScores);

      return { ...sp, score: newScore };
    };

    return results
      .filter(isUKSpeciesOrHighScore)
      .filter(blacklistedUKSpecies)
      .map(changeScoreValue);
  }

  const changeUKCommonNames = (result: ResultWithWarehouseID) => {
    const { scientificNameWithoutAuthor } = result.species;
    const speciesUKName = UKPlantNames[scientificNameWithoutAuthor];
    const commonNames = !speciesUKName ? [] : [speciesUKName]; // eslint-disable-line

    return {
      ...result,
      species: { ...result.species, commonNames },
    };
  };

  const allProcessedSpecies = res.results
    .map(addWarehouseId)
    .map(changeUKCommonNames);

  const UKProcessedSpecies = filterUKSpecies(allProcessedSpecies);

  return UKProcessedSpecies;
};

// TODO: use axios
export default async function identify(
  images: Image[]
): Promise<ResultWithWarehouseID[]> {
  const formData = new FormData();

  formData.append('organs', 'auto');
  for (const image of images) {
    // eslint-disable-next-line no-await-in-loop
    await appendModelToFormData(image, formData);
  }

  const response = (res: any) => res.json();

  const checkValidResponse = (res: any) => {
    if (res.error) throw new Error(res.error);

    return res;
  };

  const err = (error: any) => {
    if (error.message === 'Not Found') {
      return []; // always empty list
    }

    console.error(error);

    throw new Error(
      'Sorry we are experiencing some technical issues, we cannot identify your image right now, please try again later.'
    );
  };

  return fetch(`${backend.url}/api/plantnet`, {
    method: 'post',
    body: formData,
  })
    .then(response)
    .then(checkValidResponse)
    .then(processResponse)
    .catch(err);
}
