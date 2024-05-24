import { IObservableArray, reaction } from 'mobx';
import {
  device,
  ModelValidationMessage,
  useAlert,
  Sample as SampleOriginal,
  SampleAttrs,
  SampleOptions,
  SampleMetadata,
} from '@flumens';
import config from 'common/config';
import { SeedmixSpecies } from 'common/data/seedmix';
import appModel from 'models/app';
import userModel from 'models/user';
import { SpeciesNames } from 'Components/ReportView/helpers';
import beetleSurveyConfig from 'Survey/Beetle/config';
import mothSurveyConfig from 'Survey/Moth/config';
import pointSurveyConfig from 'Survey/Point/config';
import transectSurveyConfig from 'Survey/Transect/config';
import { Survey } from 'Survey/common/config';
import plantInteractions, { Interaction } from '../data/plant_interactions';
import Media from './image';
import Occurrence from './occurrence';
import GPSExtension from './sampleGPSExt';
import { modelStore } from './store';

const surveyConfigs = {
  point: pointSurveyConfig,
  transect: transectSurveyConfig,
  beetle: beetleSurveyConfig,
  moth: mothSurveyConfig,
};

type Metadata = SampleMetadata & {
  /**
   * Survey name.
   */
  survey: keyof typeof surveyConfigs;
  /**
   * If the sample was saved and ready for upload.
   */
  saved?: boolean;
  /**
   * If the sample has basic top-level details entered.
   * Doesn't mean the details aren't changed and are valid though.
   */
  completedDetails?: boolean;
};

type Attrs = SampleAttrs & {
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
  farm?: string;
  fieldName?: string;
  trapDays?: number;
  fieldInsecticides?: boolean;
  fieldHerbicides?: boolean;
  fieldUndersowing?: boolean;
  fieldCompanionCropping?: boolean;
  fieldIntercropping?: boolean;
  fieldNonCropHabitats?: string[];
  fieldCrop?: string;
  fieldTillage?: string;
  margin?: any;

  // moth survey
  surveyEndTime?: any;
  otherHabitat?: any;
};

export default class Sample extends SampleOriginal<Attrs, Metadata> {
  static fromJSON(json: any) {
    return super.fromJSON(json, Occurrence, Sample, Media);
  }

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
    super({ store: modelStore, ...options });

    this.remote.url = `${config.backend.indicia.url}/index.php/services/rest`;
    // eslint-disable-next-line
    this.remote.headers = async () => ({
      Authorization: `Bearer ${await userModel.getAccessToken()}`,
    });

    const surveyName = this.metadata.survey;
    this.survey = surveyConfigs[surveyName];

    Object.assign(this, GPSExtension());

    // listen for network update
    const autoIdentifyIfCameOnline = (isOnline?: boolean) => {
      if (!this.occurrences[0]) return;

      const { useAutoIDWhenBackOnline } = appModel.attrs;
      if (!isOnline || this.isIdentifying() || !useAutoIDWhenBackOnline) return;

      if (
        appModel.attrs.useWiFiDataConnection &&
        device.connectionType !== 'wifi'
      )
        return;

      this.occurrences[0].identify();
    };

    const listenToOnlineChange = () => device.isOnline;
    reaction(listenToOnlineChange, autoIdentifyIfCameOnline);
  }

  getSpecies() {
    if (!this.parent) {
      throw new Error('Parent does not exist');
    }

    const [occ] = this.occurrences;

    return occ.getSpecies();
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
    if (!this.parent || this.metadata.survey === 'point') {
      return '';
    }

    if (this.metadata.survey === 'beetle') {
      const byId = ({ cid }: Sample) => cid === this.cid;
      const index = this.parent.samples.findIndex(byId);

      return `Trap #${index + 1}`;
    }

    const byId = ({ cid }: Sample) => cid === this.cid;
    const index = this.parent.samples.findIndex(byId);

    return `Quadrat #${index + 1}`;
  }

  isDetailsComplete() {
    const requiresDetails =
      this.metadata.survey === 'transect' || this.metadata.survey === 'beetle';
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
      console.error(`Survey config was missing ${this.metadata.survey}`);
      return {} as Survey;
    }
  }

  destroy = () => {
    this.cleanUp();
    return super.destroy();
  };

  async upload() {
    if (this.remote.synchronising || this.isUploaded()) return true;

    const invalids = this.validateRemote();
    if (invalids) return false;

    if (!device.isOnline) return false;

    const isActivated = await userModel.checkActivation();
    if (!isActivated) return false;

    this.cleanUp();

    this.saveRemote();

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
