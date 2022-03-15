import React, { FC, useState } from 'react';
import { IonContent, IonPopover, IonIcon, IonButton } from '@ionic/react';
import { informationCircleOutline } from 'ionicons/icons';
import './styles.scss';

const InfoButton: FC = ({ children }) => {
  const [infoState, setShowInfo] = useState<any>({
    showInfo: false,
    event: undefined,
  });

  const showInfo = (e: any) => {
    e.persist();
    setShowInfo({ showInfo: true, event: e });
  };

  const hideInfo = () => setShowInfo({ showInfo: false, event: undefined });

  return (
    <IonButton
      slot="icon-only"
      size="small"
      shape="round"
      fill="clear"
      onClick={showInfo}
    >
      <IonIcon src={informationCircleOutline} />
      <IonPopover
        className="info-popover"
        event={infoState.event}
        isOpen={infoState.showInfo}
        onDidDismiss={hideInfo}
      >
        <IonContent>{children}</IonContent>
      </IonPopover>
    </IonButton>
  );
};

export default InfoButton;
