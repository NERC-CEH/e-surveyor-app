import { FC } from 'react';
import { observer } from 'mobx-react';
import { arrowUndoSharp, shareSocialOutline } from 'ionicons/icons';
import { Main, useAlert, MenuAttrToggle, InfoMessage } from '@flumens';
import { IonItemDivider, IonIcon, IonList, IonItem } from '@ionic/react';
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
  const showAlertDialog = useResetDialog(resetApp);

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
          <MenuAttrToggle
            icon={transectIcon}
            label="Shorter Common Standards"
            value={use10stepsForCommonStandard}
            onChange={onCommonStandardToggle}
          />
          <InfoMessage color="medium">
            Use 10 steps when doing Common Standards survey.
          </InfoMessage>
          <MenuAttrToggle
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

          <IonItem routerLink="/settings/seedmixes">
            <IonIcon icon={seedMixIcon} size="small" slot="start" />
            My seed mixes
          </IonItem>
        </div>

        <IonItemDivider>Application</IonItemDivider>
        <div className="rounded">
          <MenuAttrToggle
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

      <p className="app-version">{`v${config.version} (${config.build})`}</p>
    </Main>
  );
};

export default observer(Menu);
