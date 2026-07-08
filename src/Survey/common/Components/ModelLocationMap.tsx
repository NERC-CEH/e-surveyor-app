import { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
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
  toggleGPS,
  mapFlyToLocation,
} from '@flumens';
import config from 'common/config';
import Location from 'models/location';
import Sample from 'models/sample';

type Props = {
  subSample?: Sample;
  sample: Sample;
  location: Location;
};

const ModelLocationMap = ({ subSample, sample, location }: Props) => {
  const model = subSample || sample || location;
  const loc = model.data.location || {};
  const parentLocation = model.parent?.data.location;

  const setLocation = async (newLocation: any) => {
    if (!newLocation) return;
    if ('isGPSRunning' in model && model.isGPSRunning()) model.stopGPS();

    model.data.location = { ...model.data.location, ...newLocation };
  };

  const onManuallyTypedLocationChange = (e: any) =>
    setLocation(textToLocation(e?.target?.value));

  const [showSettings, setShowSettings] = useState(false);
  const onCloseSettings = () => setShowSettings(false);
  const onLayersClick = () => setShowSettings(!showSettings);

  const [currentStyle, setCurrentStyle, styles] = useMapStyles();
  const onStyleChange = (newLayer: string) => {
    setCurrentStyle(newLayer);
    setShowSettings(false);
  };

  const onMapClick = (e: any) => setLocation(mapEventToLocation(e));
  const onGPSClick = () => toggleGPS(model);

  const [mapRef, setMapRef] = useState<any>();
  const flyToLocation = () => mapFlyToLocation(mapRef, loc);
  useEffect(flyToLocation, [mapRef, loc]);

  const isLocating = 'isGPSRunning' in model ? model.isGPSRunning() : false;

  return (
    <Page id="model-location">
      <MapHeader>
        <MapHeader.Location
          location={loc}
          onChange={onManuallyTypedLocationChange}
          useGridRef
        />
      </MapHeader>
      <Main className="[--padding-bottom:0px] [--padding-top:0px]">
        <MapContainer
          onReady={setMapRef}
          onClick={onMapClick}
          accessToken={config.map.mapboxApiKey}
          mapStyle={currentStyle}
          maxPitch={0}
          initialViewState={loc}
        >
          <MapContainer.Control.Geolocate
            isLocating={isLocating}
            onClick={onGPSClick}
          />

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

          <MapContainer.OSGBGrid />

          <MapContainer.Marker
            parentGridref={parentLocation?.gridref}
            {...loc}
          />
        </MapContainer>
      </Main>
    </Page>
  );
};

export default observer(ModelLocationMap);
