import { Sample } from '@apps';
import userModel from 'userModel';
import config from 'config';
import pointSurveyConfig from 'Survey/Point/config';
import transectSurveyConfig from 'Survey/Transect/config';
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

  store = modelStore;

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
  }

  getSpecies() {
    if (!this.parent) {
      throw new Error('Parent does not exist');
    }

    const [occ] = this.occurrences;

    return occ.attrs.taxon;
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

    const defaultSpecies = {
      warehouseId: 0,
      gbif: { id: 0 },
      images: [],
      score: 0,
      species: {
        commonNames: [],
        scientificNameWithoutAuthor: '',
      },
    };

    this.occurrences[0].attrs.taxon = { ...defaultSpecies, ...species };
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
    const getScientificName = subSmp => {
      const { species } = subSmp.getSpecies() || {};

      if (!species) {
        return null;
      }

      return species.scientificNameWithoutAuthor;
    };

    let list = this.samples.map(getScientificName).filter(species => species);

    const uniqueSpeciesScientificNames = [...new Set(list)];

    const extractUniqueScientificNames = name => {
      const scientificName = image => getScientificName(image) === name;

      const fullSpecies = this.samples.find(scientificName);

      const { commonNames } = fullSpecies.getSpecies();
      let commonName;

      if (commonNames && commonNames.length) {
        [commonName] = commonNames;
      }

      return [name, commonName];
    };

    list = uniqueSpeciesScientificNames.map(extractUniqueScientificNames);

    return list;
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
}

export default AppSample;
