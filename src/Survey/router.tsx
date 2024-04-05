import BeetleRoutes from './Beetle/router';
import PointRoutes from './Point/router';
import TransectRoutes from './Transect/router';

export default [...PointRoutes, ...TransectRoutes, ...BeetleRoutes];
