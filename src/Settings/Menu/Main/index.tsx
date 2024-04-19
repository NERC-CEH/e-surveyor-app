import { observer } from 'mobx-react';
import {
  arrowUndoSharp,
  schoolOutline,
  shareSocialOutline,
  wifiOutline,
} from 'ionicons/icons';
import { Main, useAlert, Toggle, InfoMessage } from '@flumens';
import { IonIcon, IonList, IonItem } from '@ionic/react';
import config from 'common/config';
import flowerIcon from 'common/images/flowerIcon.svg';
import seedMixIcon from 'common/images/seeds.svg';
import transectIcon from 'common/images/transectIconBlack.svg';
import './styles.scss';

const useResetDialog = (resetApp: any) => {
  const alert = useAlert();

  return () =>
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
};

type Props = {
  resetApp: any;
  onToggle: (prop: string, checked: boolean) => void;
  sendAnalytics: boolean;
  use10stepsForCommonStandard: boolean;
  useAutoIDWhenBackOnline: boolean;
  useWiFiDataConnection: boolean;
  useTraining: boolean;
};

const Menu = ({
  resetApp,
  onToggle,
  sendAnalytics,
  use10stepsForCommonStandard,
  useAutoIDWhenBackOnline,
  useWiFiDataConnection,
  useTraining,
}: Props) => {
  const showAlertDialog = useResetDialog(resetApp);

  const onSendAnalyticsToggle = (checked: boolean) =>
    onToggle('sendAnalytics', checked);
  const onCommonStandardToggle = (checked: boolean) =>
    onToggle('use10stepsForCommonStandard', checked);
  const onAutoIDWhenBackOnline = (checked: boolean) =>
    onToggle('useAutoIDWhenBackOnline', checked);
  const onWiFiDataConnection = (checked: boolean) =>
    onToggle('useWiFiDataConnection', checked);
  const onTrainingToggle = (checked: boolean) =>
    onToggle('useTraining', checked);

  return (
    <Main className="app-settings">
      <IonList lines="full">
        <h3 className="list-title">Surveying</h3>
        <div className="rounded-list">
          <Toggle
            prefix={<IonIcon src={transectIcon} className="size-5" />}
            label="Shorter Common Standards"
            defaultSelected={use10stepsForCommonStandard}
            onChange={onCommonStandardToggle}
          />
          <InfoMessage inline>
            Use 10 steps when doing Common Standards survey.
          </InfoMessage>
          <Toggle
            label="Identify when reconnected"
            prefix={<IonIcon src={flowerIcon} className="size-5" />}
            onChange={onAutoIDWhenBackOnline}
            defaultSelected={useAutoIDWhenBackOnline}
          />
          <InfoMessage inline>
            When working offline the app will not be able to automatically ID
            the species. Once reconnected to the Internet we can identify the
            species in the background.
          </InfoMessage>
          <Toggle
            label="Use Wi-Fi to upload images"
            prefix={<IonIcon src={wifiOutline} className="size-5" />}
            onChange={onWiFiDataConnection}
            defaultSelected={useWiFiDataConnection}
          />
          <InfoMessage inline>
            Uncheck this if you don't want the app to use mobile data for heavy
            bandwidth connections e.g. image upload.
          </InfoMessage>
          <Toggle
            prefix={<IonIcon src={schoolOutline} className="size-6" />}
            label="Training Mode"
            defaultSelected={useTraining}
            onChange={onTrainingToggle}
          />
          <InfoMessage inline>
            Mark any new records as &#39;training&#39; and exclude from all
            reports.
          </InfoMessage>
          <IonItem routerLink="/settings/seedmixes" detail>
            <IonIcon icon={seedMixIcon} size="small" slot="start" />
            My seed mixes
          </IonItem>
        </div>

        <h3 className="list-title">Application</h3>
        <div className="rounded-list">
          <Toggle
            label="Share App Analytics"
            prefix={<IonIcon src={shareSocialOutline} className="size-5" />}
            onChange={onSendAnalyticsToggle}
            defaultSelected={sendAnalytics}
          />
          <InfoMessage inline>
            Share app crash data so we can make the app more reliable.
          </InfoMessage>

          <IonItem id="app-reset-btn" onClick={showAlertDialog}>
            <IonIcon icon={arrowUndoSharp} size="small" slot="start" />
            Reset App
          </IonItem>
        </div>
      </IonList>

      <p className="app-version">{`v${config.version} (${config.build})`}</p>
    </Main>
  );
};

export default observer(Menu);
