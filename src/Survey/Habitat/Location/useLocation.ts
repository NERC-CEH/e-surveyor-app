import { createContext, useContext } from 'react';
import { useRouteMatch } from 'react-router-dom';
import Collection from '@flumens/models/dist/Collection';
import Location from '@flumens/models/dist/Indicia/Location';

const byCid =
  (val: any) =>
  ({ cid }: any) =>
    cid === val;

const byId =
  (val: any) =>
  ({ id }: any) =>
    id === val;

const isCID = (val?: string) =>
  !!val?.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/);

export type ContextValue = {
  locations?: Collection<Location>;
};

export const LocationsContext = createContext<ContextValue>({});

type Return<T extends Location> = {
  location?: T;
  isLoading?: boolean;
};

type Props<T extends Location> = {
  location?: T;
};

function useLocation<T extends Location = Location>(
  props?: Props<T>
): Return<T> {
  const match = useRouteMatch<{ locId?: string }>();

  const { locations } = useContext(LocationsContext);
  if (!locations) return {};

  const { locId } = match.params;

  const comparator = isCID(locId) ? byCid : byId;
  const location = props?.location || (locations.find(comparator(locId)) as T);

  return { location };
}

export default useLocation;
