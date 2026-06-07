import { homeOutline, menuOutline, personOutline } from 'ionicons/icons';
import { Redirect, Route } from 'react-router';
import {
  IonTabButton,
  IonIcon,
  IonTabBar,
  IonRouterOutlet,
  IonTabs,
} from '@ionic/react';
import PendingSurveysBadge from 'Components/PendingSurveysBadge';
import LandingPage from './LandingPage';
import Menu from './Menu';
import UserSurveys from './UserSurveys';
import './styles.scss';

const HomeController = () => (
  <IonTabs>
    <IonRouterOutlet>
      <Redirect path="/home" to="/home/landing" exact />
      <Route path="/home/landing" component={LandingPage} exact />
      <Route path="/home/surveys" component={UserSurveys} exact />
      <Route path="/home/menu" component={Menu} exact />
    </IonRouterOutlet>

    <div className="absolute bottom-0 left-0 w-full">
      <div className="pointer-events-none absolute -top-12 left-0 w-full h-[calc(100%+3rem)] backdrop-blur-xl bg-white/10 [mask-image:linear-gradient(to_top,black_50%,transparent_100%)]" />
      <IonTabBar slot="bottom" className="relative">
        <IonTabButton tab="home/landing" href="/home/landing">
          <IonIcon icon={homeOutline} />
        </IonTabButton>

        <IonTabButton tab="home/surveys" href="/home/surveys">
          <IonIcon icon={personOutline} />
          <PendingSurveysBadge className="absolute bottom-1/4 left-2/4" />
        </IonTabButton>

        <IonTabButton tab="home/menu" href="/home/menu">
          <IonIcon icon={menuOutline} />
        </IonTabButton>
      </IonTabBar>
    </div>
  </IonTabs>
);

export default HomeController;
