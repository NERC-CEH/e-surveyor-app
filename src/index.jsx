import React from 'react';
import ReactDOM from 'react-dom';
import { setupConfig, isPlatform } from '@ionic/react';
import appModel from 'appModel';
import savedSamples from 'savedSamples';
import initAnalytics from 'helpers/analytics';
import { Plugins, StatusBarStyle } from '@capacitor/core';
import App from './App';

import '@ionic/core/css/core.css';
import '@ionic/core/css/ionic.bundle.css';
import 'common/theme.scss';

const { App: AppPlugin, StatusBar, SplashScreen } = Plugins;

setupConfig({
  hardwareBackButton: false, // android back button
  swipeBackEnabled: false,
});

async function init() {
  await appModel._init;
  await savedSamples._init;

  initAnalytics();

  appModel.attrs.appSession += 1;
  appModel.save();

  ReactDOM.render(<App />, document.getElementById('root'));

  if (isPlatform('hybrid')) {
    StatusBar.setStyle({
      style: StatusBarStyle.Dark,
    });

    SplashScreen.hide();

    AppPlugin.addListener('backButton', () => {
      /* disable android app exit using back button */
    });
  }
}

init();
