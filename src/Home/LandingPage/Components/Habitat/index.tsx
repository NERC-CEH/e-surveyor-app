import { observer } from 'mobx-react';
import { IonModal, IonContent } from '@ionic/react';
import HabitatIdentification from 'common/Components/HabitatIdentification';
import Location from 'common/models/location';

type Props = {
  location?: Location;
  onClose: () => void;
};

const HabitatProfile = ({ location, onClose }: Props) => (
  <IonModal
    isOpen={!!location}
    backdropDismiss={false}
    breakpoints={[0, 0.85, 1]}
    initialBreakpoint={0.85}
    onDidDismiss={onClose}
    aria-label="Identify habitat"
    className="[&>.ion-page]:pt-2"
  >
    {!!location && (
      <IonContent>
        <div className="p-3">
          <HabitatIdentification location={location} fetchOnLoad />
        </div>
      </IonContent>
    )}
  </IonModal>
);

export default observer(HabitatProfile);
