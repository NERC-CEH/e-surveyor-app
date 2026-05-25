import { Route } from 'react-router-dom';
import Home from './Home';
import pointRoutes from './Point/router';
import transectRoutes from './Transect/router';

export const baseURL = '/survey/habitat';

export default [
  <Route path={baseURL} key={baseURL} component={Home} exact />,
  ...pointRoutes,
  ...transectRoutes,
];
