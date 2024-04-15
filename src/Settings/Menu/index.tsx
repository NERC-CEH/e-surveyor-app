import { observer } from 'mobx-react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Page, Header, useToast } from '@flumens';
import { isPlatform } from '@ionic/react';
import appModelProps from 'models/app';
import userModelProps from 'models/user';
import Main from './Main';

function onToggle(appModel: any, setting: string, checked: boolean) {
  appModel.attrs[setting] = checked; // eslint-disable-line
  appModel.save();

  isPlatform('hybrid') && Haptics.impact({ style: ImpactStyle.Light });
}

type Props = {
  userModel: typeof userModelProps;
  appModel: typeof appModelProps;
  savedSamples: any;
};

const MenuController = ({ userModel, appModel, savedSamples }: Props) => {
  const toast = useToast();

  const {
    sendAnalytics,
    use10stepsForCommonStandard,
    useAutoIDWhenBackOnline,
  } = appModel.attrs;

  const resetApp = async () => {
    console.log('Settings:Menu:Controller: resetting the application!', 'w');

    try {
      await savedSamples.resetDefaults();
      await appModel.resetDefaults();
      await userModel.resetDefaults();
      toast.success('Done');
    } catch (e) {
      if (e instanceof Error) {
        toast.error(`${e.message}`);
      }
    }
  };

  const onToggleWrap = (settings: string, checked: boolean) => {
    return onToggle(appModel, settings, checked);
  };

  return (
    <Page id="settings">
      <Header title="Settings" />
      <Main
        resetApp={resetApp}
        sendAnalytics={sendAnalytics}
        use10stepsForCommonStandard={use10stepsForCommonStandard}
        onToggle={onToggleWrap}
        useAutoIDWhenBackOnline={useAutoIDWhenBackOnline}
      />
    </Page>
  );
};

export default observer(MenuController);
