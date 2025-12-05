/* eslint-disable no-bitwise */

/* eslint-disable no-restricted-syntax */
import { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import {
  MapContainer,
  Page,
  Main,
  mapFlyToLocation,
  Header,
  isValidLocation,
  LocationMarker,
} from '@flumens';
import config from 'common/config';
import Sample from 'common/models/sample';
import samples from 'models/collections/samples';
import surveyConfig from '../config';
import GeolocateButton from './GeolocateButton';

function uuidToColor(uuid: string) {
  let hash = 0;
  for (let i = 0; i < uuid.length; i++) {
    const char = uuid.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to a 32-bit integer
  }
  const red = (hash >> 16) & 0xff;
  const green = (hash >> 8) & 0xff;
  const blue = hash & 0xff;
  return `rgb(${red},${green},${blue})`;
}

type Props = {
  sample: Sample;
};

const PastSampleMap = ({ sample: model }: Props) => {
  const location = model.data.location || {};

  const [mapRef, setMapRef] = useState<any>();
  const flyToLocation = () => mapFlyToLocation(mapRef, location);
  useEffect(flyToLocation, [mapRef, location]);

  const bySoilSurvey = (smp: Sample) => smp.data.surveyId === surveyConfig.id;
  const soilSurveys = samples.filter(bySoilSurvey);

  const soilSurveyMarkers = soilSurveys.flatMap((smp: Sample) => {
    const randomColor = uuidToColor(smp.cid);

    return smp.samples.map((subSample: Sample) => {
      if (!isValidLocation(subSample.data.location)) return null;

      return (
        <LocationMarker.Circle
          key={subSample.cid}
          id={subSample.cid}
          latitude={subSample.data.location.latitude}
          longitude={subSample.data.location.longitude}
          paint={{
            'circle-color': randomColor,
            'circle-stroke-color': 'white',
          }}
        />
      );
    });
  });

  return (
    <Page id="model-location">
      <Header title="Previous samples" />

      <Main className="[--padding-bottom:0px] [--padding-top:0px]">
        <MapContainer
          onReady={setMapRef}
          accessToken={config.map.mapboxApiKey}
          mapStyle="mapbox://styles/mapbox/satellite-streets-v10"
          maxPitch={0}
          initialViewState={location}
        >
          <GeolocateButton />

          {soilSurveyMarkers}
        </MapContainer>
      </Main>
    </Page>
  );
};

export default observer(PastSampleMap);
