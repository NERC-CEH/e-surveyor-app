import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { Main, useAlert, Toggle, InfoMessage } from '@flumens';
import { IonItemDivider, IonIcon, IonList, IonItem } from '@ionic/react';
import { arrowUndoSharp, shareSocialOutline } from 'ionicons/icons';
import transectIcon from 'common/images/transectIconBlack.svg';
import flowerIcon from 'common/images/flowerIcon.svg';
import './styles.scss';

function resetDialog(alert: any, resetApp: any) {
  alert({
    header: 'Reset',
    skipTranslation: true,
    message: (
      <>
        Are you sure you want to reset the application to its initial state?
        <p>
          <b>This will wipe all the locally stored app data!</b>
        </p>
      </>
    ),
    buttons: [
      { text: 'Cancel', role: 'cancel', cssClass: 'secondary' },
      {
        text: 'Reset',
        cssClass: 'secondary',
        handler: resetApp,
      },
    ],
  });
}

type Props = {
  resetApp: any;
  onToggle: (prop: string, checked: boolean) => void;
  sendAnalytics: any;
  use10stepsForCommonStandard: any;
  useAutoIDWhenBackOnline: any;
};

const Menu: FC<Props> = ({
  resetApp,
  onToggle,
  sendAnalytics,
  use10stepsForCommonStandard,
  useAutoIDWhenBackOnline,
}) => {
  const alert = useAlert();

  const showAlertDialog = () => resetDialog(alert, resetApp);

  const onSendAnalyticsToggle = (checked: boolean) =>
    onToggle('sendAnalytics', checked);
  const onCommonStandardToggle = (checked: boolean) =>
    onToggle('use10stepsForCommonStandard', checked);
  const onAutoIDWhenBackOnline = (checked: boolean) =>
    onToggle('useAutoIDWhenBackOnline', checked);

  return (
    <Main className="app-settings">
      <IonList lines="full">
        <IonItemDivider>Surveying</IonItemDivider>
        <div className="rounded">
          <Toggle
            label="Shorter Common Standards"
            icon={transectIcon}
            onChange={onCommonStandardToggle}
            value={use10stepsForCommonStandard}
          />
          <InfoMessage color="medium">
            Use 10 steps when doing Common Standards survey.
          </InfoMessage>
          <Toggle
            label="Identify when reconnected"
            icon={flowerIcon}
            onChange={onAutoIDWhenBackOnline}
            value={useAutoIDWhenBackOnline}
          />
          <InfoMessage color="medium">
            When working offline the app will not be able to automatically ID
            the species. Once reconnected to the Internet we can identify the
            species in the background.
          </InfoMessage>
        </div>

        <IonItemDivider>Application</IonItemDivider>
        <div className="rounded">
          <Toggle
            label="Share App Analytics"
            icon={shareSocialOutline}
            onChange={onSendAnalyticsToggle}
            value={sendAnalytics}
          />
          <InfoMessage color="medium">
            Share app crash data so we can make the app more reliable.
          </InfoMessage>

          <IonItem id="app-reset-btn" onClick={showAlertDialog}>
            <IonIcon icon={arrowUndoSharp} size="small" slot="start" />
            Reset App
          </IonItem>
        </div>
      </IonList>
    </Main>
  );
};

export default observer(Menu);
