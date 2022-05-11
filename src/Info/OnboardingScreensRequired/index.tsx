import { FC } from 'react';
import AppModelType from 'models/app';
import { observer } from 'mobx-react';
import OnboardingScreens from './Components/OnBordingScreens';

interface Props {
  appModel: typeof AppModelType;
}

const OnboardingScreensController: FC<Props> = ({ appModel, children }) => {
  const { showedWelcome } = appModel.attrs;

  if (showedWelcome) {
    return <>{children}</>;
  }

  return <OnboardingScreens appModel={appModel} />;
};

export default observer(OnboardingScreensController);
