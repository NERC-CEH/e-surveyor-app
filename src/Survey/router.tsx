import ecosystemRoutes from './Ecosystem/router';
import habitatRoutes from './Habitat/router';
import soilRoutes from './Soil/router';

export default [...ecosystemRoutes, ...habitatRoutes, ...soilRoutes];
