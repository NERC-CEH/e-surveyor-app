import { device, getDeepErrorMessage } from '@flumens';
import Sample, {
  Attrs as SampleAttrs,
  Options as SampleOptions,
} from '@bit/flumens.apps.models.sample';
import { reaction } from 'mobx';
import userModel from 'models/user';
import appModel from 'models/app';
import config from 'common/config';
import { SpeciesNames } from 'Components/ReportView/helpers';
import pointSurveyConfig from 'Survey/Point/config';
import transectSurveyConfig from 'Survey/Transect/config';
import GPSExtension from './sampleGPSExt';
import plantInteractions, { Interacion } from '../data/plant_interactions';
import { modelStore } from './store';
import Occurrence, { Species } from './occurrence';
import Media from './image';

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
  location?: any;
};

class AppSample extends Sample {
  static fromJSON(json: any) {
    return super.fromJSON(json, Occurrence, AppSample, Media);
  }

  static getSupportedSpeciesList(plants: SpeciesNames[]) {
    const pollinators: Interacion[] = [];

    const getList = ([name]: SpeciesNames) => {
      const byPlantName = ({ plant }: Interacion) => plant === name;
      const sp = plantInteractions.filter(byPlantName);
      if (!sp.length) {
        return;
      }

      pollinators.push(...sp);
    };

    plants.forEach(getList);

    return pollinators;
  }

  static getUniqueSupportedSpecies(plants: SpeciesNames[]): Interacion[] {
    const pollinators = AppSample.getSupportedSpeciesList(plants);

    const getPollinatorName = ({ pollinator }: Interacion) => pollinator;

    const getPollinatorProfile = (pollinatorName: string) => {
      const matchingPollinatorName = ({ pollinator }: Interacion) =>
        pollinator === pollinatorName;

      return pollinators.find(matchingPollinatorName);
    };

    const pollinatorsNameList = pollinators.map(getPollinatorName);
    const uniquePollinatorsNameList = [
      ...new Set(pollinatorsNameList),
    ] as string[];

    const nonEmpty = (interaction: Interacion | undefined) => !!interaction;
    return uniquePollinatorsNameList
      .map(getPollinatorProfile)
      .filter(nonEmpty) as Interacion[];
  }

  attrs: Attrs = this.attrs;

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
    if (!occ || !occ.media[0]) {
      return false;
    }

    return occ.media[0].isIdentifying();
  }

  setSpecies(species: Species) {
    if (!this.parent) {
      throw new Error('Parent does not exist');
    }

    return this.occurrences[0].setSpecies(species);
  }

  getAISuggestions() {
    if (!this.parent) {
      throw new Error('Parent does not exist');
    }

    const images = this.occurrences[0].media;
    if (!images.length) {
      return false;
    }

    return images[0].attrs.species;
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

  async upload(alert: any, toast: any, loader: any) {
    if (this.remote.synchronising) {
      return true;
    }

    const invalids = this.validateRemote();
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

    if (!device.isOnline) {
      toast.warn('Looks like you are offline!');
      return false;
    }

    const isActivated = await userModel.checkActivation(toast, loader);
    if (!isActivated) {
      return false;
    }

    this.cleanUp();
    const showError = (e: any) => {
      toast.error(e);
      throw e;
    };
    this.saveRemote().catch(showError);

    return true;
  }

  startGPS: any;

  stopGPS: any;

  isGPSRunning: any;

  gpsExtensionInit: any;
}

export default AppSample;
