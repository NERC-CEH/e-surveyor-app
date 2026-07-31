import { useState } from 'react';
import { observer } from 'mobx-react';
import clsx from 'clsx';
import { close } from 'ionicons/icons';
import { Button, device, Main, useToast } from '@flumens';
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
import PhotoPicker from 'common/Components/PhotoPickers/PhotoPicker';
import Occurrence from 'models/occurrence';
import ReportView from 'Components/ReportView';
import SpeciesList from 'Components/SpeciesList';
import './styles.scss';

type Props = {
  occurrence?: Occurrence;
  onClose: any;
};

const SpeciesProfile = ({ occurrence, onClose }: Props) => {
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
        <Main className="edit-species">
          <div className="flex flex-col gap-4 m-3">
            <div className="max-w-xl rounded-list">
              <PhotoPicker model={occurrence} allowToCrop />
            </div>

            <Button
              onPress={identifySpecies}
              color="secondary"
              preventDefault
              className={clsx(
                'px-2 py-1 text-sm mx-auto my-3 w-fit bg-secondary-600',
                occurrence.isIdentifying ? 'opacity-30' : ''
              )}
            >
              Reidentify
            </Button>
            <SpeciesList
              isIdentifying={occurrence.isIdentifying}
              taxon={occurrence.data.taxon}
            />
          </div>
        </Main>
      )}

      {segment === 'report' && !!occurrence && (
        <ReportView occurrences={[occurrence]} />
      )}
    </IonModal>
  );
};

export default observer(SpeciesProfile);
