import { FC, useState, ReactNode } from 'react';
import { informationCircleOutline } from 'ionicons/icons';
import { JSX } from '@ionic/core';
import { IonContent, IonPopover, IonIcon, IonButton } from '@ionic/react';
import './styles.scss';

type Props = {
  buttonProps?: JSX.IonButton;
  children: ReactNode;
};

const InfoButton: FC<Props> = ({ children, buttonProps }) => {
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
      {...buttonProps}
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
