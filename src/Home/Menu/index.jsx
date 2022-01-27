import React from 'react';
import { observer } from 'mobx-react';
import Log from 'helpers/log';
import { IonItem, IonLabel, IonCheckbox } from '@ionic/react';
import { Page, useAlert } from '@flumens';
import { Trans as T } from 'react-i18next';
import appModel from 'models/app';
import userModel from 'models/user';
import savedSamples from 'models/savedSamples';
import Main from './Main';
import './styles.scss';

function showLogoutConfirmationDialog(alert, callback) {
  let deleteData = false;

  const onCheckboxChange = e => {
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

  function logOut() {
    Log('Info:Menu: logging out.');
    const resetWrap = async reset => {
      if (reset) {
        appModel.attrs['draftId:point'] = null;
        appModel.attrs['draftId:transect'] = null;
        await savedSamples.resetDefaults();
      }

      appModel.attrs.transects = [];
      appModel.save();
      userModel.logOut();
    };
    showLogoutConfirmationDialog(alert, resetWrap);
  }

  const isLoggedIn = userModel.hasLogIn();

  const checkActivation = () => userModel.checkActivation();
  const resendVerificationEmail = () => userModel.resendVerificationEmail();

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
