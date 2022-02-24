import { Sample, device, getDeepErrorMessage } from '@flumens';
import { reaction } from 'mobx';
import userModel from 'models/user';
import appModel from 'models/app';
import config from 'common/config';
import pointSurveyConfig from 'Survey/Point/config';
import transectSurveyConfig from 'Survey/Transect/config';
import network from 'helpers/network';
import GPSExtension from './sampleGPSExt';
import seedmixData from '../data/seedmix';
import plantInteractions from '../data/plant_interactions';
import { modelStore } from './store';
import Occurrence from './occurrence';
import Media from './image';

const surveyConfig = {
  point: pointSurveyConfig,
  transect: transectSurveyConfig,
};

class AppSample extends Sample {
  static fromJSON(json) {
    return super.fromJSON(json, Occurrence, AppSample, Media);
  }

  static getSupportedSpeciesList(plants) {
    const pollinators = [];

    const getList = ([name]) => {
      const byPlantName = ({ plant }) => plant === name;
      const sp = plantInteractions.filter(byPlantName);
      if (!sp.length) {
        return;
      }

      pollinators.push(...sp);
    };

    plants.forEach(getList);

    return pollinators;
  }

  static getUniqueSupportedSpecies(plants) {
    const pollinators = AppSample.getSupportedSpeciesList(plants);

    const getPollinatorName = ({ pollinator }) => pollinator;

    const getPollinatorProfile = pollinatorName => {
      const matchingPollinatorName = ({ pollinator }) =>
        pollinator === pollinatorName;

      return pollinators.find(matchingPollinatorName);
    };

    const pollinatorsNameList = pollinators.map(getPollinatorName);
    const uniquePollinatorsNameList = [...new Set(pollinatorsNameList)];

    return uniquePollinatorsNameList.map(getPollinatorProfile);
  }

  constructor(...args) {
    super(...args);

    this.remote.url = `${config.backend.indicia.url}/index.php/services/rest`;
    // eslint-disable-next-line
    this.remote.headers = async () => ({
      Authorization: `Bearer ${await userModel.getAccessToken()}`,
    });

    this.survey = surveyConfig[this.metadata.survey];

    Object.assign(this, GPSExtension);
    this.gpsExtensionInit();

    // listen for network update
    const autoIdentifyIfCameOnline = isOnline => {
      if (!this.occurrences[0]) return;
      if (
        !isOnline ||
        this.isIdentifying() ||
        !appModel.attrs.useAutoIDWhenBackOnline
      )
        return;

      this.occurrences[0].identify();
    };

    const listenToOnlineChange = () => network.isOnline;
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

  isIdentifying() {
    if (!this.parent) {
      const identifying = s => s.isIdentifying();
      return this.samples.some(identifying);
    }

    const [occ] = this.occurrences;
    if (!occ || !occ.media[0]) {
      return false;
    }

    return occ.media[0].isIdentifying();
  }

  setSpecies(species) {
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

  getUniqueSpecies() {
    const dict = {};

    const addToUniqueDict = subSmp => {
      const { species } = subSmp.getSpecies() || {};

      if (!species) {
        return;
      }

      const commonNames = species.commonNames || [];

      dict[species.scientificNameWithoutAuthor] = commonNames.length
        ? commonNames[0]
        : null;
    };

    this.samples.forEach(addToUniqueDict);

    return Object.entries(dict);
  }

  getSeedmixUse() {
    const { seedmix } = this.attrs;
    const seedmixSpecies = seedmixData[seedmix];
    if (!seedmixSpecies) {
      return [[]];
    }

    const extractLatinName = ({ latin_name }) => latin_name; // eslint-disable-line camelcase
    const selectedSeedmixLatinNames = seedmixSpecies.map(extractLatinName);

    const seedmixIncludesSpecies = ([scientificName]) =>
      selectedSeedmixLatinNames.includes(scientificName);

    const species = this.getUniqueSpecies();
    const recordedSeedmixSpecies = species.filter(seedmixIncludesSpecies);

    return [recordedSeedmixSpecies, seedmixSpecies];
  }

  getPrettyName() {
    if (!this.parent) {
      return '';
    }

    const byId = ({ cid }) => cid === this.cid;
    const index = this.parent.samples.findIndex(byId);

    return `Quadrat #${index + 1}`;
  }

  isDetailsComplete() {
    const requiresDetails = this.metadata.survey === 'transect';
    return requiresDetails ? this.metadata.completedDetails : true;
  }

  cleanUp = () => {
    this.stopGPS();
    const stopGPS = smp => smp.stopGPS();
    this.samples.forEach(stopGPS);
  };

  destroy = () => {
    this.cleanUp();
    super.destroy();
  };

  async upload(alert, toast) {
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

    if (!device.isOnline()) {
      toast.warn('Looks like you are offline!');
      return false;
    }

    const isActivated = await userModel.checkActivation(toast);
    if (!isActivated) {
      return false;
    }

    this.cleanUp();
    const showError = e => {
      toast.error(e);
      throw e;
    };
    this.saveRemote().catch(showError);

    return true;
  }
}

export default AppSample;
