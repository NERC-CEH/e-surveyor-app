import BeetleRoutes from './Beetle/router';
import MothRoutes from './Moth/router';
import PointRoutes from './Point/router';
import TransectRoutes from './Transect/router';

export default [
  ...PointRoutes,
  ...TransectRoutes,
  ...BeetleRoutes,
  ...MothRoutes,
];
