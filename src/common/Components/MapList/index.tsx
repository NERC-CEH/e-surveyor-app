import { useState } from 'react';
import { observer } from 'mobx-react';
import { wifiOutline } from 'ionicons/icons';
import { ViewStateChangeEvent } from 'react-map-gl/mapbox';
import { IonIcon, IonSpinner } from '@ionic/react';
import config from 'common/config';
import { device, InfoMessage, Main, MapContainer } from 'common/flumens';
import Location from 'models/location';
import GeolocateButton from './GeolocateButton';
import LocationsLayer from './LocationsLayer';
import LocationsPanel from './LocationsPanel';

type Props = {
  isFetchingLocations: boolean;
  showEmptyOption?: boolean;
  pendingLocations?: Location[];
  uploadedLocations: Location[];
  onSelectLocation?: (location?: Location) => void;
  onDeleteLocation?: (location: Location) => void;
  selectedLocationId?: string;
  location?: Location;
};

const MainLocations = ({
  pendingLocations,
  uploadedLocations,
  onSelectLocation,
  onDeleteLocation,
  selectedLocationId,
  isFetchingLocations,
  location,
  showEmptyOption,
}: Props) => {
  let initialViewState;

  if (location) {
    initialViewState = {
      latitude: parseFloat(location.data.lat),
      longitude: parseFloat(location.data.lon),
      zoom: 15,
    };
  }

  const defaultCentroid = [
    initialViewState?.latitude || 51,
    initialViewState?.longitude || -1,
  ];
  const [currentMapCenter, setCurrentMapCenter] = useState(defaultCentroid);

  const updateMapCenter = ({ viewState }: ViewStateChangeEvent) =>
    setCurrentMapCenter([viewState.latitude, viewState.longitude]);

  const locations = [...(pendingLocations || []), ...uploadedLocations];

  return (
    <Main className="pb-ion-0 pt-ion-0">
      {device.isOnline && (
        <MapContainer
          onReady={ref => ref.resize()}
          accessToken={config.map.mapboxApiKey}
          mapStyle="mapbox://styles/mapbox/satellite-streets-v10"
          maxPitch={0}
          initialViewState={initialViewState}
          onMoveEnd={updateMapCenter}
          maxZoom={19}
        >
          <GeolocateButton />

          <MapContainer.Control>
            {isFetchingLocations ? (
              <IonSpinner color="medium" className="mx-auto block" />
            ) : (
              <div />
            )}
          </MapContainer.Control>

          <LocationsLayer
            locations={locations}
            onSelectLocation={onSelectLocation}
            selectedLocationId={selectedLocationId}
          />
        </MapContainer>
      )}

      {!device.isOnline && (
        <div className="absolute top-0 z-[99999] flex h-full w-full flex-col items-center bg-[#4a4a4a] p-6">
          <InfoMessage prefix={<IonIcon src={wifiOutline} />}>
            To see the map please connect to the internet.
          </InfoMessage>
        </div>
      )}

      <LocationsPanel
        centroid={currentMapCenter}
        onSelectLocation={onSelectLocation}
        onDeleteLocation={onDeleteLocation}
        pendingLocations={pendingLocations}
        uploadedLocations={uploadedLocations}
        selectedLocationId={selectedLocationId}
        showEmptyOption={showEmptyOption}
      />
    </Main>
  );
};

export default observer(MainLocations);
