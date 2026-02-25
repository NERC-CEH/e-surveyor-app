import axios from 'axios';
import { z } from 'zod';
import { HandledError, isAxiosNetworkError } from '@flumens';
import { getCamelCaseObj } from '@flumens/utils';
import config from 'common/config';
import userModel from 'common/models/user';

const GRID_SQUARE_SIZE = '1km';

const newnessResultSchema = z.object({
  externalKey: z.string(),
  // True if the species has not been recorded before (always included)
  isNewForWebsite: z.boolean().optional(),
  // True if the species has not been recorded in the specified year (only if year parameter provided)
  isNewForYear: z.boolean().optional(),
  // True if the species has not been recorded in the specified grid square (only if grid_square_size and lat/lon provided)
  isNewForGrid: z.boolean().optional(),
  // True if the species has not been recorded in the specified group (only if group_id provided)
  isNewForGroup: z.boolean().optional(),
});

export type NewnessResult = z.infer<typeof newnessResultSchema>;

/* eslint-disable @typescript-eslint/naming-convention */
// raw API response uses snake_case
type RawNewnessResult = {
  external_key: string;
  is_new_for_website: boolean;
  is_new_for_year: boolean;
  is_new_for_grid: boolean;
};
/* eslint-enable @typescript-eslint/naming-convention */

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

  /* eslint-disable @typescript-eslint/naming-convention */
  const params = {
    // (required): The accepted taxon IDs (taxon.accepted_taxon_id) for the species being recorded.
    external_keys: externalKeys.join(','),
    // (optional): Latitude of the record location in WGS84 (decimal degrees). Must be provided if grid_square_size is specified, otherwise must not be provided.
    lat: String(lat),
    // (optional): Longitude of the record location in WGS84 (decimal degrees). Must be provided if grid_square_size is specified, otherwise must not be provided.
    lon: String(lon),
    // (optional): Size of the grid square for location-based newness checks. One of: '1km', '2km', or '10km'. Must be provided if lat/lon are specified, otherwise must not be provided.
    grid_square_size: GRID_SQUARE_SIZE,
    // (optional): Year to check for annual newness. If provided, response includes is_new_for_year badge.
    year: String(year),
    // (optional): Group ID to filter by, which corresponds to an activity ID or project ID depending on the terminology used on the client website. If provided, response includes is_new_for_group badge.
    // group_id
  };
  /* eslint-enable @typescript-eslint/naming-convention */

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
