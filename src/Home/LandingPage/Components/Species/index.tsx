import React, { FC, useState } from 'react';
import ReportView from 'Components/ReportView';
import { IonLabel, IonSegment, IonSegmentButton, IonModal } from '@ionic/react';
import { ModalHeader } from '@flumens';
import Occurrence from 'models/occurrence';
import Profile from './Components/Profile';
import './styles.scss';

interface Props {
  occurrence?: typeof Occurrence;
  onClose: any;
}
const SpeciesProfile: FC<Props> = ({ occurrence, onClose }) => {
  const [segment, setSegment] = useState('species');

  const onSegmentChange = (e: any) => setSegment(e.detail.value);

  return (
    <IonModal
      isOpen={!!occurrence}
      backdropDismiss={false}
      className="species-modal"
    >
      <ModalHeader title="Species" onClose={onClose} />

      <IonSegment value={segment} onIonChange={onSegmentChange}>
        <IonSegmentButton value="species">
          <IonLabel>Species</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="report">
          <IonLabel>Report</IonLabel>
        </IonSegmentButton>
      </IonSegment>

      {segment === 'species' && <Profile occurrence={occurrence} />}

      {segment === 'report' && !!occurrence && (
        <ReportView occurrences={[occurrence]} />
      )}
    </IonModal>
  );
};

export default SpeciesProfile;
