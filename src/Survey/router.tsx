import beetleRoutes from './Ecosystem/Beetle/router';
import mothRoutes from './Ecosystem/Moth/router';
import pointRoutes from './Habitat/Point/router';
import transectRoutes from './Habitat/Transect/router';
import soilRoutes from './Soil/Generic/router';

export default [
  ...pointRoutes,
  ...transectRoutes,
  ...beetleRoutes,
  ...mothRoutes,
  ...soilRoutes,
];
