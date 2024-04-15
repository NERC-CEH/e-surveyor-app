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

const HomeController = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Redirect path="/home" to="/home/landing" exact />
        <Route path="/home/landing" component={LandingPage} exact />
        <Route path="/home/surveys" component={UserSurveys} exact />
        <Route path="/home/menu" component={Menu} exact />
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
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
    </IonTabs>
  );
};

export default HomeController;
