import { configure as mobxConfig } from 'mobx';
import i18n from 'i18next';
import 'jeep-sqlite';
import { createRoot } from 'react-dom/client';
import { initReactI18next } from 'react-i18next';
import { App as AppPlugin } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style as StatusBarStyle } from '@capacitor/status-bar';
import { sentryOptions } from '@flumens';
import { loadingController } from '@ionic/core';
import { setupIonicReact, isPlatform } from '@ionic/react';
import { init } from '@sentry/browser';
import config from 'common/config';
import appModel from 'models/app';
import locations from 'models/collections/locations';
import samples from 'models/collections/samples';
import migrate from 'models/migrate';
import { db } from 'models/store';
import userModel from 'models/user';
import App from './App';

i18n.use(initReactI18next).init({ lng: 'en' });

console.log('🚩 App starting.');

setupIonicReact();

mobxConfig({ enforceActions: 'never' });

(async function () {
  if (isPlatform('hybrid') && !localStorage.getItem('sqliteMigrated')) {
    (await loadingController.create({ message: 'Upgrading...' })).present();
    await migrate();
    localStorage.setItem('sqliteMigrated', 'true');
    window.location.reload();
    return;
  }

  await db.init();
  await userModel.fetch();
  await appModel.fetch();
  await samples.fetch();
  await locations.fetch();

  appModel.data.sendAnalytics &&
    init({
      ...sentryOptions,
      dsn: config.sentryDSN,
      environment: config.environment,
      release: config.version,
      dist: config.build,
      enabled: config.environment === 'production',
      initialScope: {
        user: { id: userModel.id },
        tags: { session: appModel.data.appSession },
      },
    });

  appModel.data.appSession += 1;

  const container = document.getElementById('root');
  const root = createRoot(container!);
  root.render(<App />);

  if (isPlatform('hybrid')) {
    StatusBar.setStyle({
      style: StatusBarStyle.Dark,
    });

    SplashScreen.hide();

    AppPlugin.addListener('backButton', () => {
      /* disable android app exit using back button */
    });
  }
})();
