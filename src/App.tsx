import { observer } from 'mobx-react';
import { Route, Redirect } from 'react-router-dom';
import { TailwindContext, TailwindContextValue } from '@flumens';
import { IonApp, IonRouterOutlet, isPlatform } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import 'common/theme.scss';
import Home from './Home';
import OnboardingScreens from './Info/OnboardingScreensRequired';
import Info from './Info/router';
import Settings from './Settings/router';
import Survey from './Survey/router';
import User from './User/router';

const platform = isPlatform('ios') ? 'ios' : 'android';
const tailwindContext: TailwindContextValue = { platform };

const HomeRedirect = () => <Redirect to="home/landing" />;

const App = () => (
  <IonApp>
    <IonReactRouter>
      <OnboardingScreens>
        <TailwindContext.Provider value={tailwindContext}>
          <IonRouterOutlet id="main">
            <Route path="/home" component={Home} />
            {Info}
            {User}
            {Survey}
            {Settings}
            <Route exact path="/" component={HomeRedirect} />
          </IonRouterOutlet>
        </TailwindContext.Provider>
      </OnboardingScreens>
    </IonReactRouter>
  </IonApp>
);

export default observer(App);
