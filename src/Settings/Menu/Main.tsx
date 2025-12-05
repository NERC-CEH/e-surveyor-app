import { observer } from 'mobx-react';
import {
  arrowUndoOutline,
  cloudDownloadOutline,
  cloudUploadOutline,
  flameOutline,
  personRemoveOutline,
  schoolOutline,
  shareSocialOutline,
  warningOutline,
  wifiOutline,
} from 'ionicons/icons';
import { Main, useAlert, Toggle, InfoMessage } from '@flumens';
import { isPlatform } from '@ionic/core';
import { IonIcon, IonList, IonItem, IonLabel } from '@ionic/react';
import config from 'common/config';
import flowerIcon from 'common/images/flowerIcon.svg';
import seedMixIcon from 'common/images/seeds.svg';
import transectIcon from 'common/images/transectIconBlack.svg';
import { Data } from 'common/models/app';

function useDatabaseExportDialog(exportFn: any) {
  const alert = useAlert();

  const showDatabaseExportDialog = () => {
    alert({
      header: 'Export',
      message: (
        <>
          Are you sure you want to export the data?
          <p className="my-2 font-bold">
            This feature is intended solely for technical support and is not a
            supported method for exporting your data
          </p>
        </>
      ),
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Export',
          handler: exportFn,
        },
      ],
    });
  };

  return showDatabaseExportDialog;
}
function useUserDeleteDialog(deleteUser: any) {
  const alert = useAlert();

  const showUserDeleteDialog = () => {
    alert({
      header: 'Account delete',
      message: (
        <>
          Are you sure you want to delete your account?
          <InfoMessage
            color="danger"
            prefix={<IonIcon src={warningOutline} />}
            skipTranslation
          >
            This will remove your account on the{' '}
            <b>{{ url: config.backend.url } as any}</b> website. You will lose
            access to any records that you have previously submitted using the
            app or website.
          </InfoMessage>
        </>
      ),
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: deleteUser,
        },
      ],
    });
  };

  return showUserDeleteDialog;
}

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
  onToggle: (prop: keyof Data, checked: boolean) => void;
  sendAnalytics: boolean;
  use10stepsForCommonStandard: boolean;
  useAutoIDWhenBackOnline: boolean;
  useWiFiDataConnection: boolean;
  useTraining: boolean;
  useExperiments: boolean;
  isLoggedIn: boolean;
  deleteUser: any;
  exportDatabase: any;
  importDatabase: any;
};

const Menu = ({
  resetApp,
  onToggle,
  sendAnalytics,
  use10stepsForCommonStandard,
  useAutoIDWhenBackOnline,
  useWiFiDataConnection,
  useTraining,
  useExperiments,
  isLoggedIn,
  deleteUser,
  exportDatabase,
  importDatabase,
}: Props) => {
  const showAlertDialog = useResetDialog(resetApp);
  const showUserDeleteDialog = useUserDeleteDialog(deleteUser);

  const showDatabaseExportDialog = useDatabaseExportDialog(exportDatabase);

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
  const onExperimentsToggle = (checked: boolean) =>
    onToggle('useExperiments', checked);

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

          <Toggle
            prefix={<IonIcon src={flameOutline} className="size-6" />}
            label="Experimental Features"
            defaultSelected={useExperiments}
            onChange={onExperimentsToggle}
          />
          <InfoMessage inline>
            Some features are in a trial state and are subject to change in
            future releases.
          </InfoMessage>

          <IonItem id="app-reset-btn" onClick={showAlertDialog}>
            <IonIcon icon={arrowUndoOutline} size="small" slot="start" />
            Reset app
          </IonItem>

          <IonItem onClick={showDatabaseExportDialog}>
            <IonIcon icon={cloudDownloadOutline} size="small" slot="start" />
            Export database
          </IonItem>

          {!isPlatform('hybrid') && (
            <IonItem onClick={importDatabase}>
              <IonIcon icon={cloudUploadOutline} size="small" slot="start" />
              Import database
            </IonItem>
          )}
        </div>

        {isLoggedIn && (
          <>
            <h3 className="list-title">Account</h3>
            <div className="destructive-item rounded-list">
              <>
                <IonItem
                  onClick={showUserDeleteDialog}
                  className="!text-danger"
                >
                  <IonIcon
                    icon={personRemoveOutline}
                    size="small"
                    slot="start"
                  />
                  <IonLabel>Delete account</IonLabel>
                </IonItem>
                <InfoMessage inline>
                  You can delete your user account from the system.
                </InfoMessage>
              </>
            </div>
          </>
        )}
      </IonList>

      <p className="m-0 mx-auto w-full max-w-2xl p-2.5 text-right opacity-60">{`v${config.version} (${config.build})`}</p>
    </Main>
  );
};

export default observer(Menu);
