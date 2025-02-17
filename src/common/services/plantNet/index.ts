/* eslint-disable no-restricted-syntax, guard-for-in */
import axios from 'axios';
import { Location, dateFormat, isValidLocation } from '@flumens';
import config from 'common/config';
import userModel from 'common/models/user';
import Image from 'models/image';
import UKSIPlantsData from '../../data/uksi_plants.list.json';
import UKPlantNamesData from '../../data/uksi_plants.names.json';
import IndiciaAIResponse, { IndiciaAISuggestion } from './indiciaAIResponse.d';
import PlantNetResponse, { Result, Species } from './plantNetResponse.d';

export type { Species };

const UKSI_LIST_ID = 15;

type ScientificName = string;
type CommonName = string;
type WarehouseId = number;
type TVK = string;
const UKSIPlants = UKSIPlantsData as unknown as {
  [key: ScientificName]: [WarehouseId, TVK];
};
const UKPlantNames: { [key: ScientificName]: CommonName } = UKPlantNamesData;

export type ResponseResult = Omit<Result, 'species'> & {
  commonNames: string[];
  scientificName: string;
  warehouseId: number;
  tvk: string;
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
  res: IndiciaAIResponse<PlantNetResponse>
): Response => {
  const processResult = (result: Result) => {
    const { species, ...restResult } = result;
    const scientificName = species.scientificNameWithoutAuthor;
    const speciesUKName = UKPlantNames[scientificName];
    const commonNames = !speciesUKName ? [] : [speciesUKName]; // eslint-disable-line

    const [warehouseId, tvk] = UKSIPlants[scientificName] || [];

    return {
      ...restResult,
      scientificName,
      commonNames,
      warehouseId,
      tvk,
    };
  };

  const passes = (s: IndiciaAISuggestion) => s.record_cleaner === 'pass';
  const indiciaSuggestedSpecies = res.suggestions
    .filter(passes)
    .map((s: IndiciaAISuggestion) => s.taxon);

  const isIndiciaSuggested = (r: Result) =>
    indiciaSuggestedSpecies.includes(r.species.scientificNameWithoutAuthor);

  const allProcessedSpecies = res.raw.results
    .filter(isIndiciaSuggested)
    .map(processResult);

  return {
    version: res.classifier_version,
    results: allProcessedSpecies,
  };
};

// TODO: use axios
export default async function identify(
  images: Image[],
  date: string | number,
  location?: Location
): Promise<Response> {
  const token = await userModel.getAccessToken();

  const upload = (img: Image) => img.uploadFile();
  await Promise.all(images.map(upload));

  const data = new URLSearchParams({
    list: `${UKSI_LIST_ID}`,
    date: dateFormat.format(new Date(date)),
    sref: isValidLocation(location)
      ? JSON.stringify({
          srid: 4326,
          latitude: location!.latitude,
          longitude: location!.longitude,
          accuracy: location!.accuracy || 100,
        })
      : '',
    params: JSON.stringify({
      // form: { organs: ['auto'] },
      query: { 'nb-results': 1, 'include-related-images': true },
    }),
  });

  images.forEach((img: Image) => data.append('image[]', img.getRemoteURL()));

  const options: any = {
    method: 'post',
    url: `${config.backend.url}/api-proxy/indicia?_api_proxy_uri=plantnet`,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data,
    timeout: 80000,
  };

  try {
    const res = await axios<IndiciaAIResponse<PlantNetResponse>>(options);
    return processResponse(res.data);
  } catch (error: any) {
    if (error.message === 'Not Found') return { results: [], version: '' }; // always empty list

    throw new Error(
      'Sorry we are experiencing some technical issues, we cannot identify your image right now, please try again later.'
    );
  }
}
