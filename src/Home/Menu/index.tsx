import React from 'react';
import { observer } from 'mobx-react';
import { IonItem, IonLabel, IonCheckbox } from '@ionic/react';
import { Page, useAlert, useToast, useLoader } from '@flumens';
import { Trans as T } from 'react-i18next';
import appModel from 'models/app';
import userModel from 'models/user';
import savedSamples from 'models/savedSamples';
import Main from './Main';
import './styles.scss';

function showLogoutConfirmationDialog(alert: any, callback: any) {
  let deleteData = false;

  const onCheckboxChange = (e: any) => {
    deleteData = e.detail.checked;
  };

  alert({
    header: 'Logout',
    message: (
      <>
        <T>Are you sure you want to logout?</T>
        <br />
        <br />
        <IonItem lines="none" className="log-out-checkbox">
          <IonLabel>
            <T>Discard local data</T>
          </IonLabel>
          <IonCheckbox onIonChange={onCheckboxChange} />
        </IonItem>
      </>
    ),
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
      },
      {
        text: 'Logout',
        cssClass: 'primary',
        handler: () => callback(deleteData),
      },
    ],
  });
}

const Controller = () => {
  const alert = useAlert();
  const toast = useToast();
  const loader = useLoader();

  function logOut() {
    console.log('Info:Menu: logging out.');
    const resetWrap = async (reset: boolean) => {
      if (reset) {
        appModel.attrs['draftId:point'] = '';
        appModel.attrs['draftId:transect'] = '';
        await savedSamples.resetDefaults();
      }

      appModel.attrs.transects = [];
      userModel.logOut();
    };
    showLogoutConfirmationDialog(alert, resetWrap);
  }

  const isLoggedIn = userModel.isLoggedIn();

  const checkActivation = () => userModel.checkActivation(toast, loader);

  const resendVerificationEmail = () =>
    userModel.resendVerificationEmail(toast, loader);

  return (
    <Page id="info-menu">
      <Main
        user={userModel.attrs}
        appModel={appModel}
        isLoggedIn={isLoggedIn}
        logOut={logOut}
        refreshAccount={checkActivation}
        resendVerificationEmail={resendVerificationEmail}
      />
    </Page>
  );
};

export default observer(Controller);
