import { observer } from 'mobx-react';
import { IonItem, IonLabel, IonCheckbox } from '@ionic/react';
import { Page, useAlert, useToast, useLoader } from '@flumens';
import { Trans as T } from 'react-i18next';
import appModel from 'models/app';
import userModel, { useUserStatusCheck } from 'models/user';
import savedSamples from 'models/savedSamples';
import Main from './Main';
import './styles.scss';

const useConfirmationDialog = () => {
  const alert = useAlert();

  return (callback: any) => {
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
  };
};

const Controller = () => {
  const showLogoutConfirmationDialog = useConfirmationDialog();
  const toast = useToast();
  const loader = useLoader();
  const checkUserStatus = useUserStatusCheck();

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
    showLogoutConfirmationDialog(resetWrap);
  }

  const isLoggedIn = userModel.isLoggedIn();

  const resendVerificationEmail = async () => {
    if (!isLoggedIn) {
      toast.warn('Please log in first.');
      return;
    }

    await loader.show('Please wait...');

    try {
      await userModel.resendVerificationEmail();
      toast.success(
        'A new verification email was successfully sent now. If you did not receive the email, then check your Spam or Junk email folders.',
        { duration: 5000 }
      );
    } catch (e: any) {
      toast.error(e.message);
    }

    loader.hide();
  };

  return (
    <Page id="info-menu">
      <Main
        user={userModel.attrs}
        appModel={appModel}
        isLoggedIn={isLoggedIn}
        logOut={logOut}
        refreshAccount={checkUserStatus}
        resendVerificationEmail={resendVerificationEmail}
      />
    </Page>
  );
};

export default observer(Controller);
