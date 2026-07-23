import { Route } from 'react-router-dom';
import soilRoutes from './Generic/router';
import Home from './Home';

export const baseURL = '/survey/soil';

export default [
  <Route path={baseURL} key={baseURL} component={Home} exact />,
  ...soilRoutes,
];
