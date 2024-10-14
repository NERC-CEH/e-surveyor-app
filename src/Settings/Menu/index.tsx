import { useContext } from 'react';
import { observer } from 'mobx-react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Page, Header, useToast, useLoader } from '@flumens';
import { isPlatform, NavContext } from '@ionic/react';
import appModel, { Attrs } from 'models/app';
import samples from 'models/samples';
import userModel from 'models/user';
import Main from './Main';

const useDeleteUser = () => {
  const toast = useToast();
  const loader = useLoader();
  const { goBack } = useContext(NavContext);

  const deleteUser = async () => {
    console.log('Settings:Menu:Controller: deleting the user!');

    await loader.show('Please wait...');

    try {
      await userModel.delete();
      goBack();
      toast.success('Done');
    } catch (err: any) {
      toast.error(err);
    }

    loader.hide();
  };

  return deleteUser;
};

function onToggle(setting: keyof Attrs, checked: boolean) {
  (appModel.attrs as any)[setting] = checked; // eslint-disable-line
  appModel.save();

  isPlatform('hybrid') && Haptics.impact({ style: ImpactStyle.Light });
}

const MenuController = () => {
  const toast = useToast();
  const deleteUser = useDeleteUser();

  const {
    sendAnalytics,
    use10stepsForCommonStandard,
    useAutoIDWhenBackOnline,
    useWiFiDataConnection,
    useTraining,
  } = appModel.attrs;

  const resetApp = async () => {
    console.log('Settings:Menu:Controller: resetting the application!', 'w');

    try {
      await samples.reset();
      await appModel.resetDefaults();
      await userModel.resetDefaults();
      toast.success('Done');
    } catch (e) {
      if (e instanceof Error) {
        toast.error(`${e.message}`);
      }
    }
  };

  return (
    <Page id="settings">
      <Header title="Settings" />
      <Main
        isLoggedIn={userModel.isLoggedIn()}
        deleteUser={deleteUser}
        resetApp={resetApp}
        sendAnalytics={sendAnalytics}
        use10stepsForCommonStandard={use10stepsForCommonStandard}
        onToggle={onToggle}
        useTraining={useTraining}
        useAutoIDWhenBackOnline={useAutoIDWhenBackOnline}
        useWiFiDataConnection={useWiFiDataConnection}
      />
    </Page>
  );
};

export default observer(MenuController);
