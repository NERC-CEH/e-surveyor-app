import { observer } from 'mobx-react';
import { Trans as T } from 'react-i18next';
import { Device } from '@capacitor/device';
import { Page, useAlert, useToast, useLoader } from '@flumens';
import { isPlatform } from '@ionic/core';
import appModel from 'models/app';
import userModel from 'models/user';
import Main from './Main';
import './styles.scss';

const useConfirmationDialog = () => {
  const alert = useAlert();

  return (callback: any) => {
    alert({
      header: 'Logout',
      message: (
        <T>
          Are you sure you want to logout?
          <br />
          <br />
          Your pending and uploaded <b>surveys will not be deleted </b> from
          this device.
        </T>
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
          handler: () => callback(),
        },
      ],
    });
  };
};

let userInfo = '';
(async () => {
  await userModel.ready;
  userInfo = `drupal_id=${userModel.id || 'unknown'}, warehouse_id=${
    userModel.data.indiciaUserId || 'unknown'
  }`;
})();

let deviceInfo = isPlatform('android') ? 'android' : 'ios';
(async () => {
  const { model, operatingSystem, osVersion } = await Device.getInfo();
  deviceInfo = `${model}, ${operatingSystem}, ${osVersion}`;
})();

const Controller = () => {
  const showLogoutConfirmationDialog = useConfirmationDialog();
  const toast = useToast();
  const loader = useLoader();

  function logOut() {
    console.log('Info:Menu: logging out.');
    const resetWrap = async () => {
      userModel.logOut();
    };
    showLogoutConfirmationDialog(resetWrap);
  }

  const isLoggedIn = userModel.isLoggedIn();

  const checkActivation = async () => {
    await loader.show('Please wait...');
    try {
      await userModel.checkActivation();
      if (!userModel.data.verified) {
        toast.warn('The user has not been activated or is blocked.');
      }
    } catch (err: any) {
      toast.error(err);
    }
    loader.hide();
  };

  const resendVerificationEmail = async () => {
    await loader.show('Please wait...');
    try {
      await userModel.resendVerificationEmail();
      toast.success(
        'A new verification email was successfully sent now. If you did not receive the email, then check your Spam or Junk email folders.'
      );
    } catch (err: any) {
      toast.error(err);
    }
    loader.hide();
  };

  return (
    <Page id="info-menu">
      <Main
        user={userModel.data}
        appModel={appModel}
        isLoggedIn={isLoggedIn}
        logOut={logOut}
        refreshAccount={checkActivation}
        resendVerificationEmail={resendVerificationEmail}
        userInfo={userInfo}
        deviceInfo={deviceInfo}
      />
    </Page>
  );
};

export default observer(Controller);
