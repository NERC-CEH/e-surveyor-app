import { useState, ReactNode } from 'react';
import { informationCircleOutline } from 'ionicons/icons';
import { Button } from '@flumens';
import { IonContent, IonPopover, IonIcon } from '@ionic/react';
import './styles.scss';

type Props = {
  children: ReactNode;
};

const InfoButton = ({ children }: Props) => {
  const [infoState, setShowInfo] = useState<any>({
    showInfo: false,
    event: undefined,
  });

  const showInfo = (e: any) => setShowInfo({ showInfo: true, event: e });
  const hideInfo = () => setShowInfo({ showInfo: false, event: undefined });

  return (
    <Button fill="clear" onPress={showInfo} className="inline-block py-0">
      <IonIcon src={informationCircleOutline} />
      <IonPopover
        className="info-popover"
        event={infoState.event}
        isOpen={infoState.showInfo}
        onDidDismiss={hideInfo}
      >
        <IonContent>{children}</IonContent>
      </IonPopover>
    </Button>
  );
};

export default InfoButton;
