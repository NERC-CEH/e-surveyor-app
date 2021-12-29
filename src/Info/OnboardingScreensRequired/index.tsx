import React, { FC } from 'react';
import appModel from 'models/app';
import OnboardingScreens from './Components/OnBordingScreens';
import { observer } from 'mobx-react';

interface Props {
  appModel: typeof appModel;
}

const OnboardingScreensController: FC<Props> = ({ appModel, children }) => {
  const { showedWelcome } = appModel.attrs;

  if (showedWelcome) {
    return <>{children}</>;
  }

  return <OnboardingScreens appModel={appModel} />;
};

export default observer(OnboardingScreensController);
