import { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { LineString, MultiPolygon, Polygon } from 'geojson';
import { useRouteMatch } from 'react-router-dom';
import wkt from 'wellknown';
import {
  MapContainer,
  MapHeader,
  MapSettingsPanel,
  Page,
  Main,
  RadioInput,
  useMapStyles,
  textToLocation,
  mapEventToLocation,
  mapFlyToLocation,
  Location,
  MapDraw,
  getGeomMetersToLatLon,
  getGeomCenter,
  getGeomWKT,
  Header,
  updateModelLocation,
  useSample,
} from '@flumens';
import { bbox } from '@turf/bbox';
import config from 'common/config';
import Sample from 'models/sample';

export type Shape = Polygon;

export const getShapeFromGeom = (geom?: string | null) => {
  if (!geom) return undefined;

  const geomParsed = wkt.parse(geom) as Polygon | LineString | MultiPolygon;
  if (!geomParsed) return undefined;

  return getGeomMetersToLatLon(geomParsed) as
    Polygon | LineString | MultiPolygon;
};

export const getLocationAttrsFromShape = (shape?: Shape) => ({
  boundaryGeom: shape ? getGeomWKT(shape) : '',
  lat: shape ? `${getGeomCenter(shape)[1]}` : '',
  lon: shape ? `${getGeomCenter(shape)[0]}` : '',
  centroidSrefSystem: '4326',
  centroidSref: shape
    ? `${getGeomCenter(shape)[1]} ${getGeomCenter(shape)[0]}`
    : '',
});

export const getLocationAttrsFromLocation = (location?: Location) => ({
  boundaryGeom: undefined,
  lat: location ? `${location.latitude}` : '',
  lon: location ? `${location.longitude}` : '',
  centroidSrefSystem: '4326',
  centroidSref: location ? `${location.latitude} ${location.longitude}` : '',
});

export const getLocationFromSref = (sref?: string) => {
  if (!sref) return undefined;

  const [latitude, longitude] = sref.split(' ').map(Number);
  return { latitude, longitude };
};

export const getShapeCentroid = (shape?: Shape) => {
  if (!shape) return null;
  const [firstRing] = shape.coordinates as any;
  const [firstPoint] = firstRing;
  return { longitude: firstPoint[0], latitude: firstPoint[1] };
};

export const getShapeBounds = (shape?: Shape) => {
  if (!shape) return null;
  const [minLng, minLat, maxLng, maxLat] = bbox(shape);
  return [
    [minLng, minLat],
    [maxLng, maxLat],
  ];
};

type Props = {
  useShape?: boolean;
  location?: Location;
  shape?: Shape;
  isLocating?: boolean;
  setLocation: (newLocation: Location | Shape) => Promise<void>;
  stopGPS: () => void;
  startGPS: () => void;
};

const ModelLocationMap = ({
  location,
  shape,
  setLocation,
  isLocating,
  stopGPS,
  startGPS,
  useShape,
}: Props) => {
  let initialViewState: any = {};
  if (useShape) {
    initialViewState = {
      bounds: getShapeBounds(shape),
      fitBoundsOptions: { padding: 100 },
    };
  } else {
    initialViewState = location;
  }

  const onManuallyTypedLocationChange = (e: any) =>
    setLocation(textToLocation(e?.target?.value)!);

  const [showSettings, setShowSettings] = useState(false);
  const onCloseSettings = () => setShowSettings(false);
  const onLayersClick = () => setShowSettings(!showSettings);

  const [currentStyle, setCurrentStyle, styles] = useMapStyles();
  const onStyleChange = (newLayer: string) => {
    setCurrentStyle(newLayer);
    setShowSettings(false);
  };

  const onMapClick = (e: any) => setLocation(mapEventToLocation(e));
  const onGPSClick = () => (isLocating ? stopGPS() : startGPS());

  const [mapRef, setMapRef] = useState<any>();
  const flyToLocation = () => {
    if (useShape) return;
    mapFlyToLocation(mapRef, location);
  };
  useEffect(flyToLocation, [mapRef, location, useShape]);

  return (
    <Page id="model-location">
      <MapHeader>
        {!useShape && (
          <MapHeader.Location
            location={location || ({} as any)}
            onChange={onManuallyTypedLocationChange}
            useGridRef
          />
        )}
        {useShape && <Header title="Area" />}
      </MapHeader>
      <Main className="pb-ion-0 pt-ion-0">
        <MapContainer
          onReady={setMapRef}
          onClick={onMapClick}
          accessToken={config.map.mapboxApiKey}
          mapStyle={currentStyle}
          maxPitch={0}
          initialViewState={initialViewState}
        >
          {!useShape && (
            <MapContainer.Control.Geolocate
              isLocating={isLocating}
              onClick={onGPSClick}
            />
          )}

          {useShape && !!shape && (
            <MapContainer.Marker.LineArea shape={shape} />
          )}
          {useShape && (
            <MapDraw shape={shape} onChange={setLocation} isEditing="polygon">
              <MapDraw.Control polygon />
            </MapDraw>
          )}

          <MapContainer.Control.Layers onClick={onLayersClick} />
          <MapSettingsPanel isOpen={showSettings} onClose={onCloseSettings}>
            <RadioInput
              options={styles}
              onChange={onStyleChange}
              value={currentStyle}
              className="px-2"
              platform="ios"
            />
          </MapSettingsPanel>

          {!useShape && location && <MapContainer.Marker {...location} />}
        </MapContainer>
      </Main>
    </Page>
  );
};

ModelLocationMap.SampleFromRoute = observer(() => {
  const {
    params: { subSmpId },
  } = useRouteMatch<{ subSmpId?: string }>();
  const { sample, subSample } = useSample<Sample>();
  if (!sample) throw new Error('Sample is missing');
  if (subSmpId && !subSample) throw new Error('Sub-sample is missing');

  const model = subSample || sample;

  const setLocation = async (newLocation: any) => {
    if (!newLocation) return;
    if ('isGPSRunning' in model && model.isGPSRunning()) model.stopGPS();

    model.data.location = { ...model.data.location, ...newLocation };
  };

  const location = model.data.location || {};

  return (
    <ModelLocationMap
      location={location}
      setLocation={setLocation}
      isLocating={model.isGPSRunning()}
      stopGPS={() => model.stopGPS()}
      startGPS={() => model.startGPS(loc => updateModelLocation(model, loc))}
    />
  );
});

export default observer(ModelLocationMap);
