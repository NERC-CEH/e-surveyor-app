import { Route } from 'react-router-dom';
import appModel from 'models/app';
import savedSamples from 'models/savedSamples';
import userModel from 'models/user';
import Menu from './Menu';
import SeedMixes from './SeedMixes';

const MenuWrap = () => (
  <Menu appModel={appModel} savedSamples={savedSamples} userModel={userModel} />
);

export default [
  <Route
    path="/settings/menu"
    key="/settings/menu"
    exact
    component={MenuWrap}
  />,
  <Route
    path="/settings/seedmixes"
    key="/settings/seedmixes"
    exact
    component={SeedMixes}
  />,
];
