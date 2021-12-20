import { Model } from '@flumens';
import { genericStore } from './store';

class AppModel extends Model {}

const defaults = {
  appSession: 0,
  showedWelcome: false,
  showFirstSurveyTip: true,
  use10stepsForCommonStandard: false,
  sendAnalytics: true,
};

const appModel = new AppModel(genericStore, 'app', defaults);

export { appModel as default, AppModel };
