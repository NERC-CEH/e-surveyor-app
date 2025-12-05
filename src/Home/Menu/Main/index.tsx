import { observer } from 'mobx-react';
import {
  settingsOutline,
  exitOutline,
  personOutline,
  personAddOutline,
  lockClosedOutline,
  heartOutline,
  cameraOutline,
  informationCircleOutline,
  openOutline,
  helpBuoyOutline,
  mailOpenOutline,
  documentTextOutline,
} from 'ionicons/icons';
import { Trans as T } from 'react-i18next';
import { Main, InfoMessage } from '@flumens';
import { IonIcon, IonList, IonItem, IonButton } from '@ionic/react';
import config from 'common/config';
import { AppModel } from 'models/app';
import './styles.scss';

type Props = {
  logOut: any;
  refreshAccount: any;
  resendVerificationEmail: any;
  isLoggedIn: any;
  user: any;
  userInfo: string;
  deviceInfo: string;
  appModel: AppModel;
};

const MenuMain = ({
  isLoggedIn,
  user,
  logOut,
  appModel,
  refreshAccount,
  resendVerificationEmail,
  userInfo,
  deviceInfo,
}: Props) => {
  const lang = appModel.data.language;

  const isNotVerified = user.verified === false; // verified is undefined in old versions
  const userEmail = user.email as string;

  return (
    <Main className="app-menu [--padding-bottom:100px] [--padding-top:var(--ion-safe-area-top)]">
      <h1>
        <T>Menu</T>
      </h1>

      <IonList lines="full" className="max-w-xl">
        <h3 className="list-title">User</h3>
        <div className="rounded-list">
          {isLoggedIn && (
            <IonItem detail id="logout-button" onClick={logOut}>
              <IonIcon icon={exitOutline} size="small" slot="start" />
              <span className="font-medium">
                {' '}
                <T>Logout</T>
              </span>
              {': '}
              {user.fullName}
            </IonItem>
          )}

          {isLoggedIn && isNotVerified && (
            <InfoMessage className="verification-warning">
              Looks like your <b>{{ userEmail } as any}</b> email hasn't been
              verified yet.
              <div>
                <IonButton fill="outline" onClick={refreshAccount}>
                  Refresh
                </IonButton>
                <IonButton fill="clear" onClick={resendVerificationEmail}>
                  Resend Email
                </IonButton>
              </div>
            </InfoMessage>
          )}

          {!isLoggedIn && (
            <IonItem routerLink="/user/login" detail>
              <IonIcon icon={personOutline} size="small" slot="start" />
              <T>Login</T>
            </IonItem>
          )}

          {!isLoggedIn && (
            <IonItem routerLink="/user/register" detail>
              <IonIcon icon={personAddOutline} size="small" slot="start" />
              <T>Register</T>
            </IonItem>
          )}
        </div>

        <h3 className="list-title">
          <T>Settings</T>
        </h3>
        <div className="rounded-list">
          <IonItem routerLink="/settings/menu" detail>
            <IonIcon icon={settingsOutline} size="small" slot="start" />
            <T>App</T>
          </IonItem>
        </div>

        <h3 className="list-title">
          <T>Info</T>
        </h3>
        <div className="rounded-list">
          <IonItem routerLink="/info/about" detail>
            <IonIcon
              icon={informationCircleOutline}
              size="small"
              slot="start"
            />
            <T>About</T>
          </IonItem>
          <IonItem routerLink="/info/help" detail>
            <IonIcon icon={helpBuoyOutline} size="small" slot="start" />
            <T>Help</T>
          </IonItem>
          <IonItem routerLink="/info/credits" detail>
            <IonIcon icon={heartOutline} size="small" slot="start" />
            <T>Credits</T>
          </IonItem>
          <IonItem
            href="https://plantnet.org/en/how-why/"
            target="_blank"
            detail
            detailIcon={openOutline}
          >
            <IonIcon icon={cameraOutline} size="small" slot="start" />
            <T>What makes a good image?</T>
          </IonItem>
          <IonItem
            href={`mailto:esurveyor%40ceh.ac.uk?subject=e-Surveyor%20App%20Feedback&body=%0A%0A%0AApp%3A%20 v${config.version}%0AUser: ${userInfo}%0ADevice: ${deviceInfo}`}
            target="_blank"
            detail
            detailIcon={openOutline}
          >
            <IonIcon icon={mailOpenOutline} size="small" slot="start" />
            <T>Give feedback</T>
          </IonItem>
          <IonItem
            href={`${config.backend.url}/privacy-notice?lang=${lang}`}
            target="_blank"
            detail
            detailIcon={openOutline}
          >
            <IonIcon icon={lockClosedOutline} size="small" slot="start" />
            <T>Privacy policy</T>
          </IonItem>
          <IonItem
            href={`${config.backend.url}/terms-of-use?lang=${lang}`}
            target="_blank"
            detail
            detailIcon={openOutline}
          >
            <IonIcon icon={documentTextOutline} size="small" slot="start" />
            <T>Terms of use</T>
          </IonItem>
        </div>
      </IonList>
    </Main>
  );
};

export default observer(MenuMain);
