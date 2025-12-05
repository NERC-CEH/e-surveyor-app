import { ReactNode } from 'react';
import { observer } from 'mobx-react';
import appModel from 'models/app';
import OnboardingScreens from './Components/OnBordingScreens';

interface Props {
  children: ReactNode;
}

const OnboardingScreensController = ({ children }: Props) => {
  const { showedWelcome } = appModel.data;
  if (showedWelcome) return <>{children}</>;

  return <OnboardingScreens appModel={appModel} />;
};

export default observer(OnboardingScreensController);
