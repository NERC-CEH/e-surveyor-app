import { useContext } from 'react';
import { observer } from 'mobx-react';
import writeBlob from 'capacitor-blob-writer';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Share } from '@capacitor/share';
import { Page, Header, useToast, useLoader } from '@flumens';
import { isPlatform, NavContext } from '@ionic/react';
import CONFIG from 'common/config';
import { db } from 'common/models/store';
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
    useExperiments,
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

  const exportDatabase = async () => {
    const blob = await db.export();

    if (!isPlatform('hybrid')) {
      window.open(window.URL.createObjectURL(blob), '_blank');
      return;
    }

    const path = `export-${CONFIG.name}-${CONFIG.build}-${Date.now()}.db`;
    const directory = Directory.External;

    await writeBlob({ path, directory, blob });
    const { uri: url } = await Filesystem.getUri({ directory, path });
    await Share.share({ title: `App database`, files: [url] });
    await Filesystem.deleteFile({ directory, path });
  };

  // For dev purposes only
  const importDatabase = async () => {
    const blob = await new Promise<Blob>(resolve => {
      const input = document.createElement('input');
      input.type = 'file';
      input.addEventListener('change', function () {
        const fileReader = new FileReader();
        fileReader.onloadend = async (e: any) =>
          resolve(
            new Blob([e.target.result], { type: 'application/vnd.sqlite3' })
          );
        fileReader.readAsArrayBuffer(input.files![0]);
      });
      input.click();
    });

    await db.sqliteConnection.closeAllConnections();
    await db.import(blob);
    window.location.reload();
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
        useExperiments={useExperiments}
        useAutoIDWhenBackOnline={useAutoIDWhenBackOnline}
        useWiFiDataConnection={useWiFiDataConnection}
        exportDatabase={exportDatabase}
        importDatabase={importDatabase}
      />
    </Page>
  );
};

export default observer(MenuController);
