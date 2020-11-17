import React from 'react';
import PropTypes from 'prop-types';
import { Page, Header, toast } from '@apps';
import { observer } from 'mobx-react';
import Log from 'helpers/log';
import Main from './Main';

const { success, error } = toast;

const resetApp = async (saveSamples, appModel) => {
  Log('Settings:Menu:Controller: resetting the application!', 'w');
  try {
    await saveSamples.resetDefaults();
    await appModel.resetDefaults();
    success('Done');
  } catch (e) {
    error(`${e.message}`);
  }
};

const MenuController = props => {
  const { savedSamples, appModel } = props;

  const resetApplication = () => resetApp(savedSamples, appModel);

  return (
    <Page id="settings">
      <Header title="Settings" />
      <Main resetApp={resetApplication} />
    </Page>
  );
};

MenuController.propTypes = {
  appModel: PropTypes.object.isRequired,
  savedSamples: PropTypes.array.isRequired,
};

export default observer(MenuController);
