import { useState } from 'react';
import { observer } from 'mobx-react';
import clsx from 'clsx';
import { Button, device, Main, useToast } from '@flumens';
import {
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonModal,
  type SegmentCustomEvent,
} from '@ionic/react';
import PhotoPicker from 'common/Components/PhotoPickers/PhotoPicker';
import Occurrence from 'models/occurrence';
import ReportView from 'Components/ReportView';
import SpeciesList from 'Components/SpeciesList';

type Props = {
  occurrence?: Occurrence;
  onClose: () => void;
};

const SpeciesProfile = ({ occurrence, onClose }: Props) => {
  const [segment, setSegment] = useState('species');
  const toast = useToast();

  const onSegmentChange = (event: SegmentCustomEvent) =>
    setSegment(String(event.detail.value));

  const identifySpecies = async () => {
    if (!device.isOnline) {
      toast.warn("Sorry, looks like you're offline.", { position: 'bottom' });
      return;
    }

    if (!occurrence) return;

    try {
      await occurrence.identify();
    } catch (error) {
      toast.error(error, { position: 'bottom' });
    }
  };

  return (
    <IonModal
      isOpen={!!occurrence}
      backdropDismiss={false}
      breakpoints={[0, 0.85, 1]}
      initialBreakpoint={0.85}
      onDidDismiss={onClose}
      aria-label="Identify plant"
      className="[&>.ion-page]:pt-2"
    >
      <IonSegment
        value={segment}
        onIonChange={onSegmentChange}
        className="mx-auto mt-4 mb-2 w-[90%] shrink-0"
      >
        <IonSegmentButton value="species">
          <IonLabel>Species</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="report">
          <IonLabel>Report</IonLabel>
        </IonSegmentButton>
      </IonSegment>

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
