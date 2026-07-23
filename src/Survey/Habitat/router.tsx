import { Route } from 'react-router-dom';
import freeRoutes from './Free/router';
import Home from './Home';
import locationRoutes from './Location/router';
import structuredRoutes from './Structured/router';

export const baseURL = '/survey/habitat';

export default [
  <Route path={baseURL} key={baseURL} component={Home} exact />,
  ...freeRoutes,
  ...structuredRoutes,
  ...locationRoutes,
];
