import { observer } from 'mobx-react';
import { close } from 'ionicons/icons';
import {
  IonModal,
  IonButton,
  IonIcon,
  IonButtons,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/react';
import HabitatIdentification from 'common/Components/HabitatIdentification';
import Location from 'common/models/location';
import { Data } from 'Survey/Habitat/Location/config';

type Props = {
  location?: Location<Data>;
  onClose: () => void;
};

const HabitatProfile = ({ location, onClose }: Props) => (
  <IonModal isOpen={!!location} backdropDismiss={false} onDidDismiss={onClose}>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Identify Habitat</IonTitle>
        <IonButtons slot="end">
          <IonButton onClick={onClose}>
            <IonIcon slot="icon-only" icon={close} />
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>

    {!!location && (
      <IonContent>
        <div className="p-3">
          <HabitatIdentification location={location} />
        </div>
      </IonContent>
    )}
  </IonModal>
);

export default observer(HabitatProfile);
