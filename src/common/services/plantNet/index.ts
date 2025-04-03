/* eslint-disable no-restricted-syntax, guard-for-in */
import axios from 'axios';
import { Location, dateFormat, isValidLocation } from '@flumens';
import config from 'common/config';
import blackListedData from 'common/data/cacheRemote/uksi_plants_blacklist.json';
import userModel from 'common/models/user';
import Image from 'models/image';
import IndiciaAIResponse, { IndiciaAISuggestion } from './indiciaAIResponse.d';
import PlantNetResponse, { Result, Species } from './plantNetResponse.d';

const blacklisted = blackListedData.map(sp => sp.taxon);

export type { Species };

const UKSI_LIST_ID = 15;

export type ResponseResult = {
  score: number;
  commonNames: string[];
  scientificName: string;
  warehouseId: number;
  tvk: string;
  images: Result['images'];
  recordCleaner?: IndiciaAISuggestion['record_cleaner'];
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
  const getPlantNetImages = (taxon: string) => {
    const byTaxon = ({ species }: Result) =>
      species.scientificNameWithoutAuthor === taxon;
    return res.raw.results.find(byTaxon)?.images || [];
  };

  const processResult = (result: IndiciaAISuggestion) => ({
    score: result.probability,
    scientificName: result.taxon,
    commonNames: result.default_common_name
      ? [result.default_common_name!]
      : [],
    warehouseId: parseInt(result.taxa_taxon_list_id, 10),
    tvk: result.external_key,
    images: getPlantNetImages(result.taxon),
    recordCleaner: result.record_cleaner,
  });

  const isUKSpecies = (sp: IndiciaAISuggestion) => !!sp.taxa_taxon_list_id;

  const byProbability = (sp1: IndiciaAISuggestion, sp2: IndiciaAISuggestion) =>
    sp2.probability - sp1.probability;

  const blacklistedUKSpecies = (sp: IndiciaAISuggestion) =>
    !blacklisted.includes(sp.taxon);

  const allProcessedSpecies = res.suggestions
    .sort(byProbability)
    .filter(isUKSpecies)
    .filter(blacklistedUKSpecies)
    .map(processResult);

  return {
    version: res.classifier_version,
    results: allProcessedSpecies,
  };
};

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
          accuracy: 100,
        })
      : '',
    params: JSON.stringify({
      query: { 'include-related-images': true },
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
