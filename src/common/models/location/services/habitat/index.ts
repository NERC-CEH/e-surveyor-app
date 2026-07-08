/* eslint-disable no-restricted-syntax */

/* eslint-disable import-x/prefer-default-export */
import axios from 'axios';
import { camelCase, isArray, isPlainObject, mapKeys, mapValues } from 'lodash';
import {
  habitatInferenceResponseSchema,
  HabitatInferenceResponse,
} from './schema';

type UkhabPrediction =
  HabitatInferenceResponse['combinedResults']['ukhab'][number];

function camelCaseKeys<T = unknown>(value: any): T {
  if (isArray(value)) return value.map(item => camelCaseKeys(item)) as T;

  if (isPlainObject(value)) {
    const camelCasedObject = mapKeys(value, (_val, key) => camelCase(key));
    return mapValues(camelCasedObject, val => camelCaseKeys(val)) as T;
  }

  return value as T;
}

export async function predictUkhabHabitats(
  imageUrls: string[]
): Promise<UkhabPrediction[]> {
  const body = new URLSearchParams();

  for (const imageUrl of imageUrls) {
    body.append('image_urls', imageUrl);
  }

  const res = await axios.post('https://aihab-uk-api.hf.space/predict', body, {
    headers: {
      Authorization: `Bearer ${process.env.HABITAT_ACCESS_TOKEN}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  const camelCasedResponse = camelCaseKeys(res.data);

  const parsedResponse =
    habitatInferenceResponseSchema.parse(camelCasedResponse);

  return parsedResponse.combinedResults.ukhab;
}
