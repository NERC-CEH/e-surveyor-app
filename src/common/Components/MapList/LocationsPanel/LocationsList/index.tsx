import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import { IonList } from '@ionic/react';
import turf from '@turf/distance';
import Location from 'models/location';
import InfoBackgroundMessage from 'Components/InfoBackgroundMessage';
import Site from './Site';

type Props = {
  centroid: number[];
  locations: Location[];
  onSelect?: (location?: Location) => void;
  onDelete?: (location: Location) => void;
  selectedLocationId?: string | number;
  showEmptyOption?: boolean;
};

type LocationWithDistance = [Location, number];

const SitesList = ({
  centroid,
  locations,
  onSelect,
  onDelete,
  selectedLocationId,
  showEmptyOption,
}: Props) => {
  const { t } = useTranslation();

  const getLocationCoords = (loc: Location) => {
    if (!loc.data.lat || !loc.data.lon) return null;
    return [parseFloat(loc.data.lat), parseFloat(loc.data.lon)];
  };

  const getLocationWithDistance = (loc: Location): LocationWithDistance => {
    const coords = getLocationCoords(loc);
    if (!coords) return [loc, 0];

    const distance = turf(coords, centroid, { units: 'kilometers' });

    return [loc, parseFloat(distance.toFixed(2))];
  };

  const byDistance = (
    [, distanceA]: LocationWithDistance,
    [, distanceB]: LocationWithDistance
  ) => distanceA - distanceB;

  const getEntry = ([location, distance]: LocationWithDistance) => (
    <Site
      key={location.cid}
      latitude={parseFloat(location.data.lat)}
      longitude={parseFloat(location.data.lon)}
      name={location.data.name || 'Location'}
      distance={distance}
      onClick={() => onSelect?.(location)}
      isSelected={!!selectedLocationId && location.id === selectedLocationId}
      onDelete={onDelete ? () => onDelete(location) : undefined}
    />
  );

  const entries = [...locations]
    .map(getLocationWithDistance)
    .sort(byDistance)
    .map(getEntry);

  const emptyOption = !!onSelect && showEmptyOption && (
    <Site
      name={t('No site')}
      onClick={() => onSelect?.()}
      isSelected={!selectedLocationId}
      className="h-12 opacity-60"
    />
  );

  return (
    <IonList className="mt-2! list">
      {entries.length ? (
        <>
          {emptyOption}
          {entries}
        </>
      ) : (
        <InfoBackgroundMessage>
          You have no saved locations.
        </InfoBackgroundMessage>
      )}
    </IonList>
  );
};

export default observer(SitesList);
