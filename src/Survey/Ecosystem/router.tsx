import { Route } from 'react-router-dom';
import beetleRoutes from './Beetle/router';
import Home from './Home';
import mothRoutes from './Moth/router';

export const baseURL = '/survey/ecosystem';

export default [
  <Route path={baseURL} key={baseURL} component={Home} exact />,
  ...beetleRoutes,
  ...mothRoutes,
];
