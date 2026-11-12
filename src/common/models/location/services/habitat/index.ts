/* eslint-disable no-restricted-syntax */

/* eslint-disable import-x/prefer-default-export */
import axios from 'axios';
import { camelCase } from 'lodash';
import {
  habitatInferenceResponseSchema,
  HabitatInferenceResponse,
} from './schema';

type UkhabPrediction =
  HabitatInferenceResponse['combinedResults']['ukhab'][number];

function camelCaseKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(camelCaseKeys);

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        camelCase(key),
        camelCaseKeys(item),
      ])
    );
  }

  return value;
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
