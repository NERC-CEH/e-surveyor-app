import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { observer } from 'mobx-react';
import userModel from 'models/user';
import appModel from 'models/app';
import Menu from 'Components/Menu';
import RequiresLogin from 'Components/RequiresLogin';
import Home from './Home';
import Info from './Info/router';
import User from './User/router';
import Settings from './Settings/router';
import OnboardingScreens from './Info/OnboardingScreensRequired';
import Survey from './Survey/router';

const HomeRedirect = () => {
  return <Redirect to="home/surveys" />;
};

const App = () => (
  <IonApp>
    <OnboardingScreens appModel={appModel}>
      <IonReactRouter>
        <IonRouterOutlet id="user">{User}</IonRouterOutlet>
        <RequiresLogin userModel={userModel}>
          <Menu userModel={userModel} />
          <IonRouterOutlet id="main">
            <Route exact path="/" component={HomeRedirect} />
            <Route path="/home" component={Home} />
            {Info}
            {Survey}
            {Settings}
          </IonRouterOutlet>
        </RequiresLogin>
      </IonReactRouter>
    </OnboardingScreens>
  </IonApp>
);

export default observer(App);
