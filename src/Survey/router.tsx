import beetleRoutes from './Beetle/router';
import mothRoutes from './Moth/router';
import pointRoutes from './Point/router';
import soilRoutes from './Soil/router';
import transectRoutes from './Transect/router';

export default [
  ...pointRoutes,
  ...transectRoutes,
  ...beetleRoutes,
  ...mothRoutes,
  ...soilRoutes,
];
