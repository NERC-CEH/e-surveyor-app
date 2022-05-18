import { FC, useState } from 'react';
import ReportView from 'Components/ReportView';
import { observer } from 'mobx-react';
import {
  IonLabel,
  IonSegment,
  IonButton,
  IonSegmentButton,
  IonModal,
  IonIcon,
  IonButtons,
  IonHeader,
  IonToolbar,
} from '@ionic/react';
import { device, useToast } from '@flumens';
import Occurrence from 'models/occurrence';
import { close } from 'ionicons/icons';
import Profile from 'Components/Species/Main';
import './styles.scss';

interface Props {
  occurrence?: Occurrence;
  onClose: any;
}

const SpeciesProfile: FC<Props> = ({ occurrence, onClose }) => {
  const [segment, setSegment] = useState('species');
  const toast = useToast();

  const onSegmentChange = (e: any) => setSegment(e.detail.value);

  const identifySpecies = async () => {
    if (!device.isOnline) {
      toast.warn("Sorry, looks like you're offline.", { position: 'bottom' });
      return;
    }

    if (!occurrence) return;

    try {
      await occurrence.identify();
    } catch (e: any) {
      toast.error(e.message, { position: 'bottom' });
    }
  };

  const isIdentifying = occurrence?.isIdentifying();
  const identifyButton = !isIdentifying && occurrence?.canReIdentify() && (
    <IonButton
      onClick={identifySpecies}
      color="secondary"
      fill="solid"
      type="submit"
    >
      Reidentify
    </IonButton>
  );

  return (
    <IonModal
      isOpen={!!occurrence}
      backdropDismiss={false}
      className="species-modal"
    >
      <IonHeader>
        <IonToolbar>
          <IonSegment value={segment} onIonChange={onSegmentChange}>
            <IonSegmentButton value="species">
              <IonLabel>Species</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="report">
              <IonLabel>Report</IonLabel>
            </IonSegmentButton>
          </IonSegment>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>
              <IonIcon slot="icon-only" icon={close} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      {segment === 'species' && !!occurrence && (
        <>
          {identifyButton}
          <Profile occurrence={occurrence} />
        </>
      )}

      {segment === 'report' && !!occurrence && (
        <ReportView occurrences={[occurrence]} />
      )}
    </IonModal>
  );
};

export default observer(SpeciesProfile);
