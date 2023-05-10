import PointRoutes from './Point/router';
import TransectRoutes from './Transect/router';
import BeetleRoutes from './Beetle/router';

export default [...PointRoutes, ...TransectRoutes,...BeetleRoutes];
