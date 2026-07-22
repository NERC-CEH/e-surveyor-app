import { observer } from 'mobx-react';
import { Route, Redirect } from 'react-router-dom';
import {
  SamplesContext,
  TailwindBlockContext,
  TailwindContext,
  TailwindContextValue,
  defaultContext,
} from '@flumens';
import { IonApp, IonRouterOutlet, isPlatform } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import locations from 'common/models/collections/locations';
import samples from 'common/models/collections/samples';
import 'common/theme.css';
import { HeaderScrollProvider } from 'helpers/useHeaderScroll';
import { LocationsContext } from 'Survey/Habitat/Location/useLocation';
import Home from './Home';
import OnboardingScreens from './Info/OnboardingScreensRequired';
import Info from './Info/router';
import Settings from './Settings/router';
import Survey from './Survey/router';
import User from './User/router';

const platform = isPlatform('ios') ? 'ios' : 'android';
const tailwindContext: TailwindContextValue = { platform };
const tailwindBlockContext = {
  ...defaultContext,
  ...tailwindContext,
  basePath: '',
};

const samplesContext = { samples };
const locationsContext = { locations };

const HomeRedirect = () => <Redirect to="home/landing" />;

const App = () => (
  <IonApp>
    <IonReactRouter>
      <HeaderScrollProvider>
        <OnboardingScreens>
          <TailwindContext.Provider value={tailwindContext}>
            <TailwindBlockContext.Provider value={tailwindBlockContext}>
              <LocationsContext.Provider value={locationsContext}>
                <SamplesContext.Provider value={samplesContext}>
                  <IonRouterOutlet id="main">
                    <Route path="/home" component={Home} />
                    {Info}
                    {User}
                    {Survey}
                    {Settings}
                    <Route exact path="/" component={HomeRedirect} />
                  </IonRouterOutlet>
                </SamplesContext.Provider>
              </LocationsContext.Provider>
            </TailwindBlockContext.Provider>
          </TailwindContext.Provider>
        </OnboardingScreens>
      </HeaderScrollProvider>
    </IonReactRouter>
  </IonApp>
);

export default observer(App);
