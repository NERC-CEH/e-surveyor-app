/* eslint-disable no-restricted-syntax, guard-for-in */
import config from 'common/config';
import Image from 'models/image';
import UKSIPlantsData from '../../data/uksi_plants.list.json';
import UKPlantNamesData from '../../data/uksi_plants.names.json';
import appendModelToFormData from '../helpers';
import PlantNetResponse, { Result, Species } from './plantNetResponse.d';

export type { Species };

const { backend } = config;

const UKSIPlants: { [key: string]: number } = UKSIPlantsData;
const UKPlantNames: { [key: string]: string } = UKPlantNamesData;

export type ResponseResult = Omit<Result, 'species'> & {
  commonNames: string[];
  scientificName: string;
  warehouseId: number;
};

type Response = {
  version: string;
  results: ResponseResult[];
};

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

export const processResponse = (
  res: Pick<PlantNetResponse, 'results' | 'version'>
): Response => {
  const processResult = (result: Result) => {
    const { species, ...restResult } = result;
    const scientificName = species.scientificNameWithoutAuthor;
    const speciesUKName = UKPlantNames[scientificName];
    const commonNames = !speciesUKName ? [] : [speciesUKName]; // eslint-disable-line

    return {
      ...restResult,
      scientificName,
      commonNames,
      warehouseId: UKSIPlants[scientificName],
    };
  };

  const allProcessedSpecies = res.results.map(processResult);

  return {
    version: res.version,
    results: allProcessedSpecies,
  };
};

// TODO: use axios
export default async function identify(images: Image[]): Promise<Response> {
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
      return { results: [], version: '' }; // always empty list
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
