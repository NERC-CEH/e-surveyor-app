import { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import clsx from 'clsx';
import { MapRef, ViewState } from 'react-map-gl/mapbox';
import { isValidLocation, MapContainer } from '@flumens';
import { Location } from '@flumens/utils/dist/location';
import { NavContext } from '@ionic/react';
import CONFIG from 'common/config';

const disableMapInteractions = {
  onClick: () => null,
  dragPan: false,
  onDblClick: () => undefined,
  doubleClickZoom: false,
  dragRotate: false,
  scrollZoom: false,
  keyboard: false,
};

type Props = {
  location?: Location;
  link: string;
  className?: string;
};

const GeometryLink = ({ location, link, className }: Props) => {
  const { navigate } = useContext(NavContext);
  const [mapRef, setMapRef] = useState<MapRef>();

  const initialViewState: Partial<ViewState> = {
    longitude: location?.longitude || -2,
    latitude: location?.latitude || 49,
    zoom: 12,
  };

  const flyToLocation = () => {
    if (!isValidLocation(location)) return;
    mapRef?.jumpTo({
      zoom: 12,
      center: [location!.longitude, location!.latitude],
    });
  };
  useEffect(flyToLocation, [mapRef, location]);

  return (
    <div
      className={clsx('map-wrapper h-60 w-full', className)}
      onClick={() => navigate(link)}
    >
      <MapContainer
        onReady={setMapRef as any}
        accessToken={CONFIG.map.mapboxApiKey}
        attributionControl={false}
        initialViewState={initialViewState}
        mapStyle="mapbox://styles/mapbox/satellite-streets-v10"
        {...disableMapInteractions}
      >
        {location && <MapContainer.Marker {...location} />}
      </MapContainer>
    </div>
  );
};

export default observer(GeometryLink);
