import useSWR from 'swr';
import { device } from '@flumens';
import Sample from 'common/models/sample';
import fetchNewness, { NewnessResult } from './newness.api';

export type NewnessMap = Record<string, NewnessResult>;

const useNewnessCheck = (sample: Sample) => {
  // collect unique TVK keys from all occurrences
  const externalKeys = [
    ...new Set(
      sample.occurrences.map(occ => occ.data.taxon?.tvk).filter(Boolean)
    ),
  ];

  const { location } = sample.data;
  const lat = location?.latitude;
  const lon = location?.longitude;

  const hasRequiredParams =
    device.isOnline && externalKeys.length > 0 && lat && lon;

  const cacheKey = hasRequiredParams
    ? `newness-${externalKeys.sort().join(',')}-${lat}-${lon}`
    : null;

  const fetcher = () => fetchNewness({ externalKeys, lat, lon });

  const { data, error, isLoading } = useSWR<NewnessResult[]>(
    cacheKey,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60_000,
    }
  );

  // index results by externalKey for easy per-species lookup
  const newnessMap: NewnessMap = {};

  if (data) {
    const indexByKey = (result: NewnessResult) => {
      newnessMap[result.externalKey] = result;
    };

    data.forEach(indexByKey);
  }

  return { newnessMap, error, isLoading };
};

export default useNewnessCheck;
