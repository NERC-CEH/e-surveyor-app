import { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import clsx from 'clsx';
import { LineString, MultiPolygon, Polygon } from 'geojson';
import { MapRef } from 'react-map-gl/mapbox';
import { isValidLocation, MapContainer, MarkerShape } from '@flumens';
import { Location } from '@flumens/utils/dist/location';
import { NavContext } from '@ionic/react';
import CONFIG from 'common/config';
import { getShapeBounds } from 'Survey/common/Components/ModelLocationMap';

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
  shape?: Polygon | LineString | MultiPolygon;
  link: string;
  className?: string;
};

const GeometryLink = ({ location, shape, link, className }: Props) => {
  const { navigate } = useContext(NavContext);
  const [mapRef, setMapRef] = useState<MapRef>();

  let initialViewState = {};
  if (shape) {
    initialViewState = {
      bounds: getShapeBounds(shape as Polygon),
      fitBoundsOptions: { padding: 100 },
    };
  } else {
    initialViewState = {
      longitude: location?.longitude || -2,
      latitude: location?.latitude || 49,
      zoom: 12,
    };
  }

  const flyToLocation = () => {
    if (shape) {
      // has to be first because it will always be a valid location
      const bounds: any = getShapeBounds(shape as Polygon)!;
      mapRef?.fitBounds(bounds, {
        padding: 100,
        duration: 0,
      });
      return;
    }

    if (isValidLocation(location)) {
      mapRef?.jumpTo({
        zoom: 12,
        center: [location!.longitude, location!.latitude],
      });
    }
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
        {location && !shape && <MapContainer.Marker {...location} />}
        {shape && <MarkerShape shape={shape} />}
      </MapContainer>
    </div>
  );
};

export default observer(GeometryLink);
