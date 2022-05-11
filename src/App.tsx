import { FC } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { observer } from 'mobx-react';
import appModel from 'models/app';
import Home from './Home';
import Info from './Info/router';
import User from './User/router';
import Settings from './Settings/router';
import OnboardingScreens from './Info/OnboardingScreensRequired';
import Survey from './Survey/router';

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
