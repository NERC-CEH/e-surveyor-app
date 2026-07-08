import { Route } from 'react-router-dom';
import Home from './Home';
import locationRoutes from './Location/router';
import pointRoutes from './Point/router';
import transectRoutes from './Transect/router';
import './theme.css';

export const baseURL = '/survey/habitat';

export default [
  <Route path={baseURL} key={baseURL} component={Home} exact />,
  ...pointRoutes,
  ...transectRoutes,
  ...locationRoutes,
];
