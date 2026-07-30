import { useState } from 'react';
import { observer } from 'mobx-react';
import { informationCircleOutline } from 'ionicons/icons';
import { Trans as T } from 'react-i18next';
import { device } from '@flumens/utils';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonContent,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  useIonViewWillLeave,
  useIonViewWillEnter,
  IonIcon,
} from '@ionic/react';
import { InfoMessage } from 'common/flumens';
import Location from 'models/location';
import LocationsList from './LocationsList';

const SNAP_POSITIONS = [0.05, 0.3, 0.5, 1];
const DEFAULT_SNAP_POSITION = 0.3;
const DEFAULT_SNAP_POSITION_IF_NO_CONNECTION = 1;

type Props = {
  centroid: number[];
  selectedLocationId?: string | number;
  onSelectLocation?: (loc?: Location) => void;
  onDeleteLocation?: (loc: Location) => void;
  showEmptyOption?: boolean;
  pendingLocations?: Location[];
  uploadedLocations: Location[];
};

const LocationsPanel = ({
  centroid,
  onSelectLocation,
  onDeleteLocation,
  selectedLocationId,
  pendingLocations,
  uploadedLocations,
  showEmptyOption,
}: Props) => {
  const [isMounted, setIsMounted] = useState(true);

  const isPartOfSurvey = !pendingLocations;

  const [segment, setSegment] = useState<'pending' | 'uploaded'>(
    isPartOfSurvey ? 'uploaded' : 'pending'
  );

  const onSegmentClick = (e: any) => setSegment(e.detail.value);

  const unMountBottomSheet = () => setIsMounted(false); // hack, this component is mounted as a parent with root div
  const mountBottomSheet = () => setIsMounted(true); // hack, this component is mounted as a parent with root div
  useIonViewWillLeave(unMountBottomSheet);
  useIonViewWillEnter(mountBottomSheet);

  const defaultPosition = device.isOnline
    ? DEFAULT_SNAP_POSITION
    : DEFAULT_SNAP_POSITION_IF_NO_CONNECTION;

  return (
    <div className="wrap-to-prevent-modal-from-crashing">
      <IonModal
        isOpen={isMounted}
        backdropDismiss={false}
        backdropBreakpoint={0.5}
        breakpoints={SNAP_POSITIONS}
        initialBreakpoint={defaultPosition}
        canDismiss
        className="[&::part(handle)]:mt-2"
      >
        {!isPartOfSurvey && (
          <IonHeader className="ion-no-border">
            <IonToolbar className="pt-5! text-black bg-ion-neutral-100">
              <IonSegment onIonChange={onSegmentClick} value={segment}>
                <IonSegmentButton value="pending">
                  <IonLabel className="ion-text-wrap">
                    <T>Pending</T>
                  </IonLabel>
                </IonSegmentButton>

                <IonSegmentButton value="uploaded">
                  <IonLabel className="ion-text-wrap">
                    <T>Uploaded</T>
                  </IonLabel>
                </IonSegmentButton>
              </IonSegment>
            </IonToolbar>
          </IonHeader>
        )}

        <IonContent className="pt-ion-5">
          {segment === 'pending' && !isPartOfSurvey && (
            <LocationsList
              centroid={centroid}
              locations={pendingLocations}
              onSelect={onSelectLocation}
              selectedLocationId={selectedLocationId}
              onDelete={onDeleteLocation}
              showEmptyOption={showEmptyOption}
            />
          )}

          {segment === 'uploaded' && (
            <>
              <InfoMessage
                className="mx-3"
                prefix={<IonIcon icon={informationCircleOutline} />}
                color="primary"
              >
                Your sites come from the Habitat Type survey.
              </InfoMessage>

              <LocationsList
                centroid={centroid}
                locations={uploadedLocations}
                onSelect={onSelectLocation}
                selectedLocationId={selectedLocationId}
              />
            </>
          )}
        </IonContent>
      </IonModal>
    </div>
  );
};

export default observer(LocationsPanel);
