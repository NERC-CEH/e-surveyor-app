import React, { FC } from 'react';
import {
  IonTabButton,
  IonIcon,
  IonTabBar,
  IonRouterOutlet,
  IonTabs,
} from '@ionic/react';
import { Redirect, Route } from 'react-router';
import { homeOutline, menuOutline, personOutline } from 'ionicons/icons';
import savedSamples from 'models/savedSamples';
import PendingSurveysBadge from 'Components/PendingSurveysBadge';
import UserSurveys from './UserSurveys';
import LandingPage from './LandingPage';
import Menu from './Menu';
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
          </div>
          <PendingSurveysBadge savedSamples={savedSamples} />
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
