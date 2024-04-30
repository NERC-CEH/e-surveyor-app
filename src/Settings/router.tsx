import { Route } from 'react-router-dom';
import Menu from './Menu';
import SeedMixes from './SeedMixes';

export default [
  <Route path="/settings/menu" key="/settings/menu" exact component={Menu} />,
  <Route
    path="/settings/seedmixes"
    key="/settings/seedmixes"
    exact
    component={SeedMixes}
  />,
];
