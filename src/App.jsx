import React, { useContext } from 'react';
import { Route, Switch } from 'react-router-dom';
import { IonApp, IonPage, IonRouterOutlet, NavContext } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { observer } from 'mobx-react';
import Home from './Home';
import Info from './Info/router';
import Settings from './Settings/router';
import Survey from './Survey/router';

const HomeRedirect = () => {
  const { navigate } = useContext(NavContext);
  navigate('/home/surveys', 'root'); // simple redirect component doesn't work when back from login
  return null;
};

const App = () => (
  <IonApp>
    <IonReactRouter>
      <Route exact path="/" component={HomeRedirect} />
      <IonPage id="main">
        <Switch>
          <Route path="/home" component={Home} />
          <IonRouterOutlet>
            {Survey}
            {Info}
            {Settings}
          </IonRouterOutlet>
        </Switch>
      </IonPage>
    </IonReactRouter>
  </IonApp>
);

export default observer(App);
