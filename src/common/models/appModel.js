import { Model } from '@apps';
import { genericStore } from './store';

class AppModel extends Model {}

const defaults = {
  useGridRef: true,
  useGridMap: true,
};

const appModel = new AppModel(genericStore, 'app', defaults);

export { appModel as default, AppModel };
