import axios from 'axios';
import { z } from 'zod';
import { HandledError, isAxiosNetworkError } from '@flumens';
import { getCamelCaseObj } from '@flumens/utils';
import config from 'common/config';
import userModel from 'common/models/user';

const GRID_SQUARE_SIZE = '1km';

const newnessResultSchema = z.object({
  externalKey: z.string(),
  isNewForWebsite: z.boolean().optional(),
  isNewForYear: z.boolean().optional(),
  isNewForGrid: z.boolean().optional(),
});

export type NewnessResult = z.infer<typeof newnessResultSchema>;

// raw API response uses snake_case
type RawNewnessResult = {
  external_key: string;
  is_new_for_website: boolean;
  is_new_for_year: boolean;
  is_new_for_grid: boolean;
};

type Params = {
  externalKeys: string[];
  lat: number;
  lon: number;
};

const fetchNewness = async ({
  externalKeys,
  lat,
  lon,
}: Params): Promise<NewnessResult[]> => {
  const year = new Date().getFullYear();

  const params = {
    external_keys: externalKeys.join(','),
    lat: String(lat),
    lon: String(lon),
    grid_square_size: GRID_SQUARE_SIZE,
    year: String(year),
  };

  try {
    const { data } = await axios<RawNewnessResult[]>({
      url: `${config.backend.indicia.url}/index.php/services/rest/occurrences/check-newness`,
      method: 'get',
      params,
      headers: { Authorization: `Bearer ${await userModel.getAccessToken()}` },
    });

    const camelCaseData = data.map(getCamelCaseObj) as NewnessResult[];
    camelCaseData.forEach(result => newnessResultSchema.parse(result));

    return camelCaseData;
  } catch (error: any) {
    if (isAxiosNetworkError(error) || 'issues' in error) {
      throw new HandledError('Network error during newness check.');
    }

    throw error;
  }
};

export default fetchNewness;
