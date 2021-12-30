import React, { FC } from 'react';
import { Page, Header, toast } from '@flumens';
import appModelProps from 'models/app';
import userModelProps from 'models/user';
import { observer } from 'mobx-react';
import Log from 'helpers/log';
import Main from './Main';

const { success, error } = toast;

const resetApp = async (
  saveSamples: any,
  appModel: typeof appModelProps,
  userModel: typeof userModelProps
) => {
  Log('Settings:Menu:Controller: resetting the application!', 'w');

  try {
    await saveSamples.resetDefaults();
    await appModel.resetDefaults();
    await userModel.resetDefaults();
    success('Done');
  } catch (e) {
    if (e instanceof Error) {
      error(`${error.message}`);
    }
  }
};

function onToggle(appModel: any, setting: string, checked: boolean) {
  appModel.attrs[setting] = checked; // eslint-disable-line
  appModel.save();
}

type Props = {
  userModel: typeof userModelProps;
  appModel: typeof appModelProps;
  savedSamples: any;
};

const MenuController: FC<Props> = ({ userModel, appModel, savedSamples }) => {
  const { sendAnalytics, use10stepsForCommonStandard } = appModel.attrs;

  const resetApplication = () => resetApp(savedSamples, appModel, userModel);

  const onToggleWrap = (settings: string, checked: boolean) => {
    return onToggle(appModel, settings, checked);
  };

  return (
    <Page id="settings">
      <Header title="Settings" />
      <Main
        resetApp={resetApplication}
        sendAnalytics={sendAnalytics}
        use10stepsForCommonStandard={use10stepsForCommonStandard}
        onToggle={onToggleWrap}
      />
    </Page>
  );
};

export default observer(MenuController);
