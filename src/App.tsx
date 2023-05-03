import { FC } from 'react';
import { observer } from 'mobx-react';
import { Route, Redirect } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import appModel from 'models/app';
import Home from './Home';
import OnboardingScreens from './Info/OnboardingScreensRequired';
import Info from './Info/router';
import Settings from './Settings/router';
import Survey from './Survey/router';
import User from './User/router';

const HomeRedirect = () => {
  return <Redirect to="home/landing" />;
};

const App: FC = () => (
  <IonApp>
    <IonReactRouter>
      <OnboardingScreens appModel={appModel}>
        <IonRouterOutlet id="main">
          <Route path="/home" component={Home} />
          {Info}
          {User}
          {Survey}
          {Settings}
          <Route exact path="/" component={HomeRedirect} />
        </IonRouterOutlet>
      </OnboardingScreens>
    </IonReactRouter>
  </IonApp>
);

export default observer(App);
