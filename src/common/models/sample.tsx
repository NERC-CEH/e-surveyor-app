import { IObservableArray, reaction } from 'mobx';
import {
  device,
  ModelValidationMessage,
  useAlert,
  Sample as SampleOriginal,
  SampleAttrs,
  SampleOptions,
  SampleMetadata,
  ChoiceValues,
} from '@flumens';
import config from 'common/config';
import { SeedmixSpecies } from 'common/data/seedmix';
import appModel from 'models/app';
import userModel from 'models/user';
import { SpeciesNames } from 'Components/ReportView/helpers';
import beetleSurveyConfig, {
  fieldCropAttr,
  fieldNonCropHabitatsAttr,
  fieldTillageAttr,
} from 'Survey/Beetle/config';
import mothSurveyConfig from 'Survey/Moth/config';
import pointSurveyConfig from 'Survey/Point/config';
import soilSurveyConfig, {
  SOMIDAttr,
  coverCropAttr,
  cropAttr,
  labClayAttr,
  labSandAttr,
  labSiltAttr,
  landUseAttr,
  landUseOtherAttr,
  prevCoverCropAttr,
  sampleNameAttr,
  wormCountAttr,
} from 'Survey/Soil/config';
import transectSurveyConfig from 'Survey/Transect/config';
import { dateAttr, Survey } from 'Survey/common/config';
import plantInteractions, { Interaction } from '../data/plant_interactions';
import Media from './image';
import Occurrence from './occurrence';
import GPSExtension from './sampleGPSExt';
import { samplesStore } from './store';

const surveyConfigs = {
  [pointSurveyConfig.id]: pointSurveyConfig,
  [transectSurveyConfig.id]: transectSurveyConfig,
  [beetleSurveyConfig.id]: beetleSurveyConfig,
  [mothSurveyConfig.id]: mothSurveyConfig,
  [soilSurveyConfig.id]: soilSurveyConfig,
};

export type SoilSubSampleType = 'worms' | 'som' | 'vsa';

type Metadata = SampleMetadata & {
  /**
   * If the sample was saved and ready for upload.
   */
  saved?: boolean;
  /**
   * If the sample has basic top-level details entered.
   * Doesn't mean the details aren't changed and are valid though.
   */
  completedDetails?: boolean;
  /**
   * Soil survey sub-samples.
   */
  type: SoilSubSampleType;
};

const cropAttrId = cropAttr().id;

export type Attrs = SampleAttrs & {
  [dateAttr.id]?: string;

  surveyId: keyof typeof surveyConfigs;
  habitat?: any;
  name?: any;
  type?: any;
  steps?: any;
  date?: any;
  seeded?: any;
  seedmix?: any;
  quadratSize?: any;
  seedmixgroup?: any;
  customSeedmix?: SeedmixSpecies[];
  location?: any;

  // beetle survey
  [fieldTillageAttr.id]: string;
  [fieldNonCropHabitatsAttr.id]?: ChoiceValues<
    typeof fieldNonCropHabitatsAttr.choices
  >[];
  [fieldCropAttr.id]: string;

  // moth survey
  surveyEndTime?: any;
  otherHabitat?: any;

  // soil survey
  [landUseAttr.id]?: ChoiceValues<typeof landUseAttr.choices>[];
  [coverCropAttr.id]?: ChoiceValues<typeof coverCropAttr.choices>[];
  [prevCoverCropAttr.id]?: ChoiceValues<typeof prevCoverCropAttr.choices>[];
  [landUseOtherAttr.id]?: string;
  [cropAttrId]?: string;
  [wormCountAttr.id]?: number;
  [SOMIDAttr.id]?: string;
  [sampleNameAttr.id]?: string;
  [labSandAttr.id]: number;
  [labSiltAttr.id]: number;
  [labClayAttr.id]: number;
};

export default class Sample extends SampleOriginal<Attrs, Metadata> {
  static getSupportedSpeciesList(plants: SpeciesNames[]) {
    const pollinators: Interaction[] = [];

    const getList = ([name]: SpeciesNames) => {
      const byPlantName = ({ plant }: Interaction) => plant === name;
      const sp = plantInteractions.filter(byPlantName);
      if (!sp.length) {
        return;
      }

      pollinators.push(...sp);
    };

    plants.forEach(getList);

    return pollinators;
  }

  static getUniqueSupportedSpecies(plants: SpeciesNames[]): Interaction[] {
    const pollinators = Sample.getSupportedSpeciesList(plants);

    const getPollinatorName = ({ pollinator }: Interaction) => pollinator;

    const getPollinatorProfile = (pollinatorName: string) => {
      const matchingPollinatorName = ({ pollinator }: Interaction) =>
        pollinator === pollinatorName;

      return pollinators.find(matchingPollinatorName);
    };

    const pollinatorsNameList = pollinators.map(getPollinatorName);
    const uniquePollinatorsNameList = Array.from(new Set(pollinatorsNameList));

    const nonEmpty = (interaction: Interaction | undefined) => !!interaction;
    return uniquePollinatorsNameList
      .map(getPollinatorProfile)
      .filter(nonEmpty) as Interaction[];
  }

  declare occurrences: IObservableArray<Occurrence>;

  declare samples: IObservableArray<Sample>;

  declare media: IObservableArray<Media>;

  declare parent?: Sample;

  declare survey: Survey;

  constructor(options: SampleOptions) {
    super({
      ...options,
      url: config.backend.indicia.url,
      getAccessToken: () => userModel.getAccessToken(),
      Occurrence,
      Media,
      store: samplesStore,
    });

    this.survey = surveyConfigs[this.data.surveyId];

    if (!this.survey) {
      // backwards compatible
      this.survey = surveyConfigs[(this.data as any).survey_id];

      const surveyConfigsByName: any = {
        point: pointSurveyConfig,
        transect: transectSurveyConfig,
        beetle: beetleSurveyConfig,
        moth: mothSurveyConfig,
        soil: soilSurveyConfig,
      };

      this.survey =
        this.survey || surveyConfigsByName[(this.metadata as any).survey];
      this.data.surveyId = this.survey.id;
    }

    Object.assign(this, GPSExtension());

    // listen for network update
    const autoIdentifyIfCameOnline = (isOnline?: boolean) => {
      if (!this.occurrences[0]) return;

      const { useAutoIDWhenBackOnline } = appModel.data;
      if (!isOnline || this.isIdentifying() || !useAutoIDWhenBackOnline) return;

      if (
        appModel.data.useWiFiDataConnection &&
        device.connectionType !== 'wifi'
      )
        return;

      this.occurrences[0].identify();
    };

    const listenToOnlineChange = () => device.isOnline;
    reaction(listenToOnlineChange, autoIdentifyIfCameOnline);
  }

  getSpecies() {
    if (!this.parent) throw new Error('Can only use fn with sub-samples.');
    return this.occurrences[0].getSpecies();
  }

  isIdentifying(): boolean {
    if (!this.parent) {
      const identifying = (s: Sample) => s.isIdentifying();
      return this.samples.some(identifying);
    }

    const [occ] = this.occurrences;
    if (!occ || !occ.media[0]) return false;

    return occ.isIdentifying();
  }

  getPrettyName() {
    if (!this.parent || this.data.surveyId === pointSurveyConfig.id) {
      return '';
    }

    if (this.data.surveyId === beetleSurveyConfig.id) {
      const byId = ({ cid }: Sample) => cid === this.cid;
      const index = this.parent.samples.findIndex(byId);

      return `Trap #${index + 1}`;
    }

    if (this.data.surveyId === soilSurveyConfig.id && this.parent) {
      return this.data[sampleNameAttr.id];
    }

    const byId = ({ cid }: Sample) => cid === this.cid;
    const index = this.parent.samples.findIndex(byId);

    return `Quadrat #${index + 1}`;
  }

  isDetailsComplete() {
    const requiresDetails =
      this.data.surveyId === transectSurveyConfig.id ||
      this.data.surveyId === beetleSurveyConfig.id;
    return requiresDetails ? this.metadata.completedDetails : true;
  }

  cleanUp = () => {
    this.stopGPS();
    const stopGPS = (smp: Sample) => smp.stopGPS();
    this.samples.forEach(stopGPS);
  };

  getSurvey() {
    try {
      return super.getSurvey() as Survey;
    } catch (error) {
      console.error(`Survey config was missing ${this.data.surveyId}`);
      return {} as Survey;
    }
  }

  destroy = () => {
    this.cleanUp();
    return super.destroy();
  };

  async syncRemote(onError?: any) {
    if (this.isSynchronising || !this.requiresRemoteSync()) return true;

    const invalids = this.validateRemote();
    if (invalids) return false;

    if (!device.isOnline) return false;

    const isActivated = await userModel.checkActivation();
    if (!isActivated) return false;

    this.cleanUp();

    if (this.data.surveyId === soilSurveyConfig.id) {
      onError('Uploading of a Beta survey is not enabled yet.');
      return false;
    }

    if (!this.syncedAt) {
      this.saveRemote().catch(onError);
      return true;
    }

    this.updateRemote();
    return true;
  }

  isPersistent() {
    return true;
  }

  startGPS: any;

  stopGPS: any;

  isGPSRunning: any;

  gpsExtensionInit: any;
}

export const useValidateCheck = (sample: Sample) => {
  const alert = useAlert();

  const showValidateCheck = () => {
    const invalids = sample.validateRemote();
    if (invalids) {
      alert({
        header: 'Survey incomplete',
        skipTranslation: true,
        message: <ModelValidationMessage {...invalids} />,
        buttons: [
          {
            text: 'Got it',
            role: 'cancel',
          },
        ],
      });
      return false;
    }
    return true;
  };

  return showValidateCheck;
};
