import { Model } from '@apps';
import { genericStore } from './store';

class AppModel extends Model {}

const defaults = {
  showedWelcome: false,
  showFirstSurveyTip: true,
  use10stepsForCommonStandard: false,
  sendAnalytics: true,
};

const appModel = new AppModel(genericStore, 'app', defaults);

export { appModel as default, AppModel };
