/* eslint-disable no-restricted-syntax */

/* eslint-disable guard-for-in */
import config from 'common/config';
import Image from 'models/image';
import appendModelToFormData from '../helpers';
import ServiceResponse, { Species } from './beetleResponse.d';

type ResponseResultA = {
  score: number;
  warehouseId: number;
  commonNames: string[];
  scientificName: string;
  tvk: string;
};

type Response = {
  version: string;
  results: ResponseResultA[];
};

export const processResponse = (res: ServiceResponse): Response => {
  const changeUKCommonNames = (result: Species) => {
    return {
      score: result.score,
      warehouseId: parseInt(result.indicia_taxon_id, 10),
      scientificName: result.class,
      commonNames: [], // TODO:
      tvk: '',
    };
  };

  const allProcessedSpecies = res.predictions.map(changeUKCommonNames);

  return {
    version: '1', // TODO: read from the response when available
    results: allProcessedSpecies,
  };
};

// TODO: use axios
export default async function identify(images: Image[]): Promise<Response> {
  const formData = new FormData();

  for (const image of images) {
    // eslint-disable-next-line no-await-in-loop
    await appendModelToFormData(image, formData, 'image');
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

  return fetch(config.backend.beetlePredictUrl, {
    method: 'post',
    body: formData,
  })
    .then(response)
    .then(checkValidResponse)
    .then(processResponse)
    .catch(err);
}
