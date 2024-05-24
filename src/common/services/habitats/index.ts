/* eslint-disable no-restricted-syntax, guard-for-in */
import axios from 'axios';
import { z, object, ZodError } from 'zod';
import { HandledError, isAxiosNetworkError } from '@flumens';
import config from 'common/config';

// import dummyNVCResponse from './dummy_NVC_API_result.json';
// import dummyBroadResponse from './dummy_broad_API_result.json';

const { backend } = config;

const remoteBroadHabitatSchema = object({
  broadHabitat: z.string(),
  rank: z.number(),
  matchingCoefficient: z.number(),
  UKHab: z.string(),
  description: z.string(),
  typicalSpecies: z.array(
    object({
      commonName: z.string(),
      scientificName: z.string(),
      bsbiid: z.string().optional(),
      bsbiphotoindex: z.number().optional(),
    })
  ),
});

export type BroadHabitat = z.infer<typeof remoteBroadHabitatSchema>;

type TVK = string;

export async function identifyBroad(species: TVK[]): Promise<BroadHabitat[]> {
  const options = {
    url: `${backend.habitatPredictUrl}/broadhabitat`,
    method: 'post',
    body: { input_tvks: species },
  };

  try {
    const res = await axios<BroadHabitat[]>(options);

    // const res = { data: dummyBroadResponse };
    // await new Promise(r => setTimeout(r, 2000));

    res.data.forEach(d => remoteBroadHabitatSchema.parse(d));

    return res.data;
  } catch (error: any) {
    if (isAxiosNetworkError(error))
      throw new HandledError(
        'Request aborted because of a network issue (timeout or similar).'
      );

    if ('issues' in error) {
      const err: ZodError = error;
      throw new Error(
        err.issues.map(e => `${e.path.join(' ')} ${e.message}`).join(' ')
      );
    }

    throw error;
  }
}

const remoteNVCHabitatSchema = object({
  NVCHabitat: z.string(),
  similarityScore: z.number(),
  rank: z.number(),
  fullName: z.string(),
  typicalSpecies: z.array(
    object({
      commonName: z.string(),
      scientificName: z.string(),
      bsbiid: z.string().optional(),
      bsbiphotoindex: z.number().optional(),
    })
  ),
});

export type NVCHabitat = z.infer<typeof remoteNVCHabitatSchema>;

export async function identifyNVC(species: TVK[]): Promise<NVCHabitat[]> {
  const options = {
    url: `${backend.habitatPredictUrl}/nvc`,
    method: 'post',
    body: { input_tvks: species },
  };

  try {
    const res = await axios<NVCHabitat[]>(options);

    // const res = { data: dummyNVCResponse };
    // await new Promise(r => setTimeout(r, 2000));

    res.data.forEach(d => remoteNVCHabitatSchema.parse(d));

    return res.data;
  } catch (error: any) {
    if (isAxiosNetworkError(error))
      throw new HandledError(
        'Request aborted because of a network issue (timeout or similar).'
      );

    if ('issues' in error) {
      const err: ZodError = error;
      throw new Error(
        err.issues.map(e => `${e.path.join(' ')} ${e.message}`).join(' ')
      );
    }

    throw error;
  }
}
