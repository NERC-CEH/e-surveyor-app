import { useState, type ReactNode } from 'react';
import clsx from 'clsx';
import { informationCircleOutline } from 'ionicons/icons';
import { Button } from '@flumens';
import { IonContent, IonPopover, IonIcon } from '@ionic/react';
import './styles.scss';

type Props = {
  children: ReactNode;
  className?: string;
};

const InfoButton = ({ children, className }: Props) => {
  const [infoState, setInfoState] = useState<{
    showInfo: boolean;
    event?: Event;
  }>({ showInfo: false });

  const showInfo = (event: Event) => setInfoState({ showInfo: true, event });
  const hideInfo = () => setInfoState({ showInfo: false, event: undefined });

  return (
    <Button
      fill="clear"
      onClick={event => showInfo(event.nativeEvent)}
      className={clsx('inline-block py-0', className)}
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
    </Button>
  );
};

export default InfoButton;
