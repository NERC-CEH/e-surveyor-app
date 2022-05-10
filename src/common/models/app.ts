import { set } from 'mobx';
import { Model, ModelAttrs } from '@oldBit';
import { SeedmixSpecies } from 'common/data/seedmix';
import { genericStore } from './store';

export type SurveyDraftKeys = {
  'draftId:point'?: string;
  'draftId:transect'?: string;
};

export type SeedMix = {
  id: string;
  name: string;
  species: SeedmixSpecies[];
};

export interface Attrs extends ModelAttrs, SurveyDraftKeys {
  language: string;
  appSession: number;
  showedWelcome: boolean;
  showFirstSurveyTip: boolean;
  showSurveyUploadTip: boolean;
  showSurveysDeleteTip: boolean;
  showFirstPhotoTip: boolean;
  showFirstLowScorePhotoTip: boolean;
  use10stepsForCommonStandard: boolean;
  useAutoIDWhenBackOnline: boolean;
  sendAnalytics: boolean;
  transects?: any[];
  seedmixes: SeedMix[];
}

const defaults: Attrs = {
  language: '',
  appSession: 0,
  showedWelcome: false,
  showFirstSurveyTip: true,
  showSurveyUploadTip: true,
  showSurveysDeleteTip: true,
  showFirstPhotoTip: true,
  showFirstLowScorePhotoTip: true,
  useAutoIDWhenBackOnline: true,
  use10stepsForCommonStandard: false,
  sendAnalytics: true,
  seedmixes: [],
};

class AppModel extends Model {
  attrs: Attrs = Model.extendAttrs(this.attrs, defaults);

  resetDefaults() {
    set(this.attrs, {});
    delete this.id;
    return this.save();
  }

  deleteSeedmix(seedmixId: string) {
    const byId = (seedmix: SeedMix) => seedmix.id === seedmixId;
    const index = this.attrs.seedmixes.findIndex(byId);

    this.attrs.seedmixes.splice(index, 1);
  }

  saveSeedmix(seedmixToSave: SeedMix) {
    const byId = ({ id }: SeedMix) => id === seedmixToSave.id;
    const existingSeedmix = this.attrs.seedmixes.find(byId);
    if (existingSeedmix) {
      existingSeedmix.name = seedmixToSave.name || 'My seedmix'; // in case user deleted
      existingSeedmix.species = seedmixToSave.species;
      return;
    }

    this.attrs.seedmixes.push(seedmixToSave);
  }
}

const appModel = new AppModel({ cid: 'app', store: genericStore });

export { appModel as default, AppModel };
