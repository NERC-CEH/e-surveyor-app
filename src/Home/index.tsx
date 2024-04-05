import { FC } from 'react';
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

const HomeController: FC = () => {
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
          <div className="tab-highlight">
            <IonIcon icon={homeOutline} />
          </div>
        </IonTabButton>

        <IonTabButton tab="home/surveys" href="/home/surveys">
          <div className="tab-highlight">
            <IonIcon icon={personOutline} />
            <PendingSurveysBadge className="absolute bottom-1/4 left-2/4" />
          </div>
        </IonTabButton>

        <IonTabButton tab="home/menu" href="/home/menu">
          <div className="tab-highlight">
            <IonIcon icon={menuOutline} />
          </div>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default HomeController;
