import { set } from 'mobx';
import { Model, ModelAttrs } from '@flumens';
import { genericStore } from './store';

export type SurveyDraftKeys = {
  'draftId:point'?: string;
  'draftId:transect'?: string;
};

export interface Attrs extends ModelAttrs, SurveyDraftKeys {
  language: string;
  appSession: number;
  showedWelcome: boolean;
  showFirstSurveyTip: boolean;
  showSurveyUploadTip: boolean;
  showSurveysDeleteTip: boolean;
  use10stepsForCommonStandard: boolean;
  useAutoIDWhenBackOnline: boolean;
  sendAnalytics: boolean;
  transects?: any[];
}

const defaults: Attrs = {
  language: '',
  appSession: 0,
  showedWelcome: false,
  showFirstSurveyTip: true,
  showSurveyUploadTip: true,
  showSurveysDeleteTip: true,
  useAutoIDWhenBackOnline: true,
  use10stepsForCommonStandard: false,
  sendAnalytics: true,
};

class AppModel extends Model {
  attrs: Attrs = Model.extendAttrs(this.attrs, defaults);

  resetDefaults() {
    set(this.attrs, {});
    delete this.id;
    return this.save();
  }
}

const appModel = new AppModel({ cid: 'app', store: genericStore });

export { appModel as default, AppModel };

// declare const appModel: {
//   _init: any;

//   attrs: {
//     appSession: number;
//     showedWelcome: boolean;
//     showFirstSurveyTip: boolean;
//     use10stepsForCommonStandard: boolean;
//     sendAnalytics: boolean;
//   } & surveyDraftKeys;

//   save: () => void;
//   resetDefaults: () => void;
// };

// export default appModel;
