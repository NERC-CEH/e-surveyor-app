/* eslint-disable no-restricted-syntax */

/* eslint-disable guard-for-in */
import axios from 'axios';
import { z, object, ZodError } from 'zod';
import config from 'common/config';
import { HandledError, isAxiosNetworkError } from 'common/flumens';
import { Suggestion } from 'common/models/occurrence';
import userModel from 'common/models/user';

const remoteSchema = object({
  probability: z.number(),
  taxa_taxon_list_id: z.string(),
  taxon: z.string(),

  classifier_id: z.string().optional(),
  classifier_name: z.string().optional(),
  group: z.number().optional(),
  authority: z.string().optional(),
  preferred_taxa_taxon_list_id: z.string().optional(),
  language_iso: z.string().optional(),
  preferred: z.string().optional(),
  preferred_taxon: z.string().optional(),
  preferred_authority: z.string().optional(),
  /**
   * @deprecated this comes from the server which might differ from the app ones. Don't use it.
   */
  default_common_name: z.string().optional(),
  taxon_meaning_id: z.string().optional(),
});

type RemoteAttributes = z.infer<typeof remoteSchema>;

export default async function identify(
  url: string
): Promise<{ version: number; results: Suggestion[] }> {
  const token = await userModel.getAccessToken();

  const data = new URLSearchParams({ image: url });

  const params = new URLSearchParams({
    _api_proxy_uri: 'identify-proxy/v1/?app_name=uni-jena',
  });

  const options: any = {
    method: 'post',
    params,
    url: `${config.backend.url}/api-proxy/waarneming`,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data,
    timeout: 80000,
  };

  try {
    const res = await axios<RemoteAttributes[]>(options);
    const normalizeBaseValues = (sp: RemoteAttributes): Suggestion => ({
      score: sp.probability,
      warehouseId: parseInt(sp.taxa_taxon_list_id!, 10),
      scientificName: sp.taxon,
      commonNames: [], // TODO:
    });

    res.data.forEach(d => remoteSchema.parse(d));

    const results = res.data.map(normalizeBaseValues);

    return { version: 1, results };
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
