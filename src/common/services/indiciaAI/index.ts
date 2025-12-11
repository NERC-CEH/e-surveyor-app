/* eslint-disable no-restricted-syntax, guard-for-in */
import axios from 'axios';
import z, { object } from 'zod';
import { Location, dateFormat, isValidLocation } from '@flumens';
import IndiciaAIResponse, { IndiciaAISuggestion } from './indiciaAIResponse.d';

const suggestionSchema = object({
  probability: z.number(),
  commonNames: z.array(z.string()),
  scientificName: z.string(),
  group: z.number().int(),
  warehouseId: z.number().int(),
  tvk: z.string(),
  recordCleaner: z
    .enum(['pass', 'warn', 'fail', 'omit', 'error', 'invalid'])
    .optional(),
});

export type Suggestion = z.infer<typeof suggestionSchema>;

// exported for testing purposes
export const processSuggestion = (
  res: IndiciaAIResponse<any>
): Suggestion[] => {
  const processResult = (result: IndiciaAISuggestion): Suggestion => ({
    probability: result.probability,
    scientificName: result.taxon,
    group: parseInt(result.taxon_group_id, 10),
    commonNames: result.default_common_name
      ? [result.default_common_name!]
      : [],
    warehouseId: parseInt(result.taxa_taxon_list_id, 10),
    tvk: result.external_key,
    recordCleaner: result.record_cleaner,
  });

  let nonUKSpeciesScores = 0;
  const isUKSpecies = (sp: IndiciaAISuggestion) => {
    const isUkSpecies = !!sp.taxa_taxon_list_id;
    if (isUkSpecies) return true;

    nonUKSpeciesScores += sp.probability;

    return false;
  };

  const byProbability = (sp1: IndiciaAISuggestion, sp2: IndiciaAISuggestion) =>
    sp2.probability - sp1.probability;

  const changeScoreValue = (sp: IndiciaAISuggestion) => ({
    ...sp,
    probability: sp.probability / (1 - nonUKSpeciesScores),
  });

  return res.suggestions
    .sort(byProbability)
    .filter(isUKSpecies)
    .map(changeScoreValue)
    .map(processResult);
};

type Params = {
  images: string[];
  url: string;
  getAccessToken: () => Promise<string>;
  listId: string | number;
  model?: 'plantnet' | 'waarneming';
  date?: string | number;
  location?: Location;
};

export default async function identify<T>({
  images,
  listId,
  url,
  getAccessToken,
  model,
  date,
  location,
}: Params) {
  const dateParam = date ? dateFormat.format(new Date(date)) : '';
  const srefParam = isValidLocation(location)
    ? JSON.stringify({
        srid: 4326,
        latitude: location!.latitude,
        longitude: location!.longitude,
        accuracy: 100,
      })
    : '';

  const data = new URLSearchParams({
    list: `${listId}`,
    date: dateParam,
    sref: srefParam,
    params: JSON.stringify({
      query: { 'include-related-images': true },
    }),
  });

  images.forEach((img: string) => data.append('image[]', img));

  const options: any = {
    method: 'post',
    url: `${url}/api-proxy/indicia`,
    params: { _api_proxy_uri: model },
    headers: {
      Authorization: `Bearer ${await getAccessToken()}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data,
    timeout: 80000,
  };

  try {
    const res = await axios<IndiciaAIResponse<T>>(options);

    return {
      classifierId: res.data.classifier_id,
      classifierVersion: res.data.classifier_version,
      suggestions: processSuggestion(res.data),
      raw: res.data.raw as T,
    };
  } catch (error: any) {
    if (error.message === 'Not Found')
      return { classifierId: '', classifierVersion: '', suggestions: [] }; // always empty list

    throw new Error(
      'Sorry we are experiencing some technical issues, we cannot identify your image right now, please try again later.'
    );
  }
}
