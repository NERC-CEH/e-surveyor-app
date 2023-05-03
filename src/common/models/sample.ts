import { reaction } from 'mobx';
import {
  device,
  getDeepErrorMessage,
  useAlert,
  Sample,
  SampleAttrs,
  SampleOptions,
} from '@flumens';
import config from 'common/config';
import { SeedmixSpecies } from 'common/data/seedmix';
import appModel from 'models/app';
import userModel from 'models/user';
import { SpeciesNames } from 'Components/ReportView/helpers';
import pointSurveyConfig from 'Survey/Point/config';
import transectSurveyConfig from 'Survey/Transect/config';
import plantInteractions, { Interaction } from '../data/plant_interactions';
import Media from './image';
import Occurrence from './occurrence';
import GPSExtension from './sampleGPSExt';
import { modelStore } from './store';

const surveyConfig = {
  point: pointSurveyConfig,
  transect: transectSurveyConfig,
};

type Attrs = SampleAttrs & {
  habitat?: any;
  name?: any;
  type?: any;
  steps?: any;
  date?: any;
  seedmix?: any;
  quadratSize?: any;
  seedmixgroup?: any;
  customSeedmix?: SeedmixSpecies[];
  location?: any;
};

export default class AppSample extends Sample {
  static fromJSON(json: any) {
    return super.fromJSON(json, Occurrence, AppSample, Media);
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
    const pollinators = AppSample.getSupportedSpeciesList(plants);

    const getPollinatorName = ({ pollinator }: Interaction) => pollinator;

    const getPollinatorProfile = (pollinatorName: string) => {
      const matchingPollinatorName = ({ pollinator }: Interaction) =>
        pollinator === pollinatorName;

      return pollinators.find(matchingPollinatorName);
    };

    const pollinatorsNameList = pollinators.map(getPollinatorName);
    const uniquePollinatorsNameList = [
      ...new Set(pollinatorsNameList),
    ] as string[];

    const nonEmpty = (interaction: Interaction | undefined) => !!interaction;
    return uniquePollinatorsNameList
      .map(getPollinatorProfile)
      .filter(nonEmpty) as Interaction[];
  }

  attrs: Attrs = this.attrs;

  occurrences: Occurrence[] = this.occurrences;

  samples: AppSample[] = this.samples;

  media: Media[] = this.media;

  constructor(options: SampleOptions) {
    super(options);

    this.remote.url = `${config.backend.indicia.url}/index.php/services/rest`;
    // eslint-disable-next-line
    this.remote.headers = async () => ({
      Authorization: `Bearer ${await userModel.getAccessToken()}`,
    });

    this.survey = (surveyConfig as any)[this.metadata.survey];

    Object.assign(this, GPSExtension());

    // listen for network update
    const autoIdentifyIfCameOnline = (isOnline?: boolean) => {
      if (!this.occurrences[0]) return;

      const { useAutoIDWhenBackOnline } = appModel.attrs;
      if (!isOnline || this.isIdentifying() || !useAutoIDWhenBackOnline) return;

      this.occurrences[0].identify();
    };

    const listenToOnlineChange = () => device.isOnline;
    reaction(listenToOnlineChange, autoIdentifyIfCameOnline);
  }

  store = modelStore;

  getSpecies() {
    if (!this.parent) {
      throw new Error('Parent does not exist');
    }

    const [occ] = this.occurrences;

    return occ.getSpecies();
  }

  isIdentifying(): boolean {
    if (!this.parent) {
      const identifying = (s: AppSample) => s.isIdentifying();
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

    const byId = ({ cid }: AppSample) => cid === this.cid;
    const index = this.parent.samples.findIndex(byId);

    return `Quadrat #${index + 1}`;
  }

  isDetailsComplete() {
    const requiresDetails = this.metadata.survey === 'transect';
    return requiresDetails ? this.metadata.completedDetails : true;
  }

  cleanUp = () => {
    this.stopGPS();
    const stopGPS = (smp: AppSample) => smp.stopGPS();
    this.samples.forEach(stopGPS);
  };

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

export const useValidateCheck = (sample: AppSample) => {
  const alert = useAlert();

  return () => {
    const invalids = sample.validateRemote();
    if (invalids) {
      alert({
        header: 'Survey incomplete',
        message: getDeepErrorMessage(invalids),
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
};
