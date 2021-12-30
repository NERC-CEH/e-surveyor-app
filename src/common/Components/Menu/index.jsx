import React from 'react';
import appModel from 'models/app';
import savedSamples from 'models/savedSamples';
import config from 'common/config';
import { useAlert } from '@flumens';
import PropTypes from 'prop-types';
import { withRouter, useLocation } from 'react-router';
import Log from 'helpers/log';
import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonCheckbox,
  IonFooter,
} from '@ionic/react';
import {
  homeOutline,
  heartCircleOutline,
  personOutline,
  logOut,
  settingsOutline,
  informationCircleOutline,
} from 'ionicons/icons';
import { observer } from 'mobx-react';
import { Trans as T } from 'react-i18next';
import 'common/images/flumens.svg';
import './styles.scss';

const routes = {
  appPages: [
    { title: 'Home', path: '/home/surveys', icon: homeOutline },

    {
      title: 'About',
      path: '/info/about',
      icon: informationCircleOutline,
    },

    {
      title: 'Credits',
      path: '/info/credits',
      icon: heartCircleOutline,
    },
    {
      title: 'Settings',
      path: '/settings/menu',
      icon: settingsOutline,
    },
  ],
  loggedOutPages: [
    { title: 'Register/Sign In', path: '/user/register', icon: personOutline },
  ],
};

function showLogoutConfirmationDialog(alert, callback) {
  let deleteData = true;

  const onCheckboxChange = e => {
    deleteData = e.detail.checked;
  };

  alert({
    header: 'Logout',
    message: (
      <>
        <T>Are you sure you want to logout?</T>
        <br />
        <br />
        <IonItem lines="none" className="log-out-checkbox">
          <IonLabel>
            <T>Discard local data</T>
          </IonLabel>
          <IonCheckbox
            checked
            onIonChange={onCheckboxChange}
            color="secondary"
          />
        </IonItem>
      </>
    ),
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
      },

      {
        text: 'Logout',
        cssClass: 'primary',
        handler: () => callback(deleteData),
      },
    ],
  });
}

function renderMenuRoutes(list, location) {
  const getMenuItem = p => (
    <IonMenuToggle key={p.title} auto-hide="false">
      <IonItem
        detail={false}
        routerLink={p.path}
        href={p.href}
        routerDirection="none"
        className={
          location.pathname.startsWith(p.path) ? 'selected' : undefined
        }
      >
        <IonIcon slot="start" icon={p.icon} />
        <IonLabel>
          <T>{p.title}</T>
        </IonLabel>
      </IonItem>
    </IonMenuToggle>
  );

  return list.map(getMenuItem);
}

function loggingOut(alert, userModel) {
  Log('Home:Info: logging out.');

  const onLogout = reset => {
    if (reset) {
      savedSamples.resetDefaults();
    }
    appModel.save();
    userModel.logOut();
  };

  showLogoutConfirmationDialog(alert, onLogout);
}

const getLogoutButton = (alert, userModel) => {
  const userName = userModel.attrs.fullName || userModel.attrs.email;
  const loggingOutWrap = () => loggingOut(alert, userModel);

  return (
    <IonItem detail={false} routerDirection="none" onClick={loggingOutWrap}>
      <IonIcon slot="start" icon={logOut} />
      <IonLabel>
        <T>Logout</T>: {userName}
      </IonLabel>
    </IonItem>
  );
};

const Menu = ({ userModel }) => {
  const location = useLocation();
  const alert = useAlert();

  const getRoutes = routesList => renderMenuRoutes(routesList, location);

  return (
    <IonMenu type="overlay" contentId="main">
      <IonContent forceOverscroll={false}>
        <IonList lines="none">
          <IonListHeader>
            <T>Navigate</T>
          </IonListHeader>
          {getRoutes(routes.appPages)}
        </IonList>

        <IonList lines="none">
          <IonListHeader>
            <T>Account</T>
          </IonListHeader>
          {getLogoutButton(alert, userModel)}
        </IonList>
      </IonContent>
      <IonFooter className="ion-no-border">
        <div>
          <a href="https://flumens.io">
            <img src="/images/flumens.svg" alt="" />
          </a>

          <p className="app-version">{`App version: v${config.version} (${config.build})`}</p>
        </div>
      </IonFooter>
    </IonMenu>
  );
};

Menu.propTypes = {
  userModel: PropTypes.object.isRequired,
};

export default withRouter(observer(Menu));
