import { Model, ModelAttrs, type ModelOptions } from '@flumens';
import { SeedmixSpecies } from 'common/data/seedmix';
import { mainStore } from '../store';
import initialise, {
  type AppNotification,
  type Extension as NotificationsExtension,
} from './notificationsExt';

export type SurveyDraftKeys = {
  'draftId:habitat-location'?: string;
  'draftId:habitat-free'?: string;
  'draftId:habitat-structured'?: string;
  'draftId:beetle'?: string;
  'draftId:moth'?: string;
  'draftId:soil'?: string;
};

export type SeedMix = {
  id: string;
  name: string;
  species: SeedmixSpecies[];
};

export type Data = {
  notifications: AppNotification[];
  language: string;
  appSession: number;
  showedWelcome: boolean;
  showFirstSurveyTip: boolean;
  showSurveyUploadTip: boolean;
  showSurveysDeleteTip: boolean;
  showFirstPhotoTip: boolean;
  showFirstLowScorePhotoTip: boolean;
  showWiFiSettingTip: boolean;
  showSoilDataSharingTip: boolean;
  showMothSpeciesListTip: boolean;
  use10stepsForCommonStandard: boolean;
  useAutoIDWhenBackOnline: boolean;
  showTermsUpdatedMessage: boolean;
  sendAnalytics: boolean;
  /**
   * Enable un-released features.
   */
  useExperiments: boolean;
  /**
   * If the app should do bandwidth-heavy connections using WiFi only.
   */
  useWiFiDataConnection: boolean;
  /**
   * Flag new samples for training.
   */
  useTraining: boolean;
  seedmixes: SeedMix[];
} & ModelAttrs &
  SurveyDraftKeys;

const defaults: Data = {
  notifications: [],
  language: '',
  appSession: 0,
  showedWelcome: false,
  showFirstSurveyTip: true,
  showSurveyUploadTip: true,
  showSurveysDeleteTip: true,
  showFirstPhotoTip: true,
  showMothSpeciesListTip: true,
  showTermsUpdatedMessage: true,
  showFirstLowScorePhotoTip: true,
  showWiFiSettingTip: true,
  showSoilDataSharingTip: true,
  useAutoIDWhenBackOnline: true,
  use10stepsForCommonStandard: false,
  useExperiments: false,
  useWiFiDataConnection: false,
  useTraining: false,
  sendAnalytics: true,
  seedmixes: [],
};

export class AppModel extends Model<Data> {
  declare notifications: NotificationsExtension;

  constructor(options: ModelOptions<Data>) {
    super({ ...options, data: { ...defaults, ...options.data } });

    this.notifications = initialise(this);
  }

  deleteSeedmix(seedmixId: string) {
    const byId = (seedmix: SeedMix) => seedmix.id === seedmixId;
    const index = this.data.seedmixes.findIndex(byId);

    this.data.seedmixes.splice(index, 1);
  }

  saveSeedmix(seedmixToSave: SeedMix) {
    const byId = ({ id }: SeedMix) => id === seedmixToSave.id;
    const existingSeedmix = this.data.seedmixes.find(byId);
    if (existingSeedmix) {
      existingSeedmix.name = seedmixToSave.name || 'My seedmix'; // in case user deleted
      existingSeedmix.species = seedmixToSave.species;
      return;
    }

    this.data.seedmixes.push(seedmixToSave);
  }

  reset() {
    return super.reset(defaults);
  }
}

const appModel = new AppModel({ cid: 'app', store: mainStore });

export default appModel;
