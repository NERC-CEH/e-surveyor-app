import { Sample } from '@apps';
import GPSExtension from './sampleGPSExt';
import surveyConfig from '../../Survey/config';
import seedmixData from '../data/seedmix';
import plantInteractions from '../data/plant_interactions';
import { modelStore } from './store';
import Occurrence from './occurrence';
import Media from './image';

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

    Object.assign(this, GPSExtension);
    this.gpsExtensionInit();
  }

  keys = () => {
    return { ...Sample.keys, ...this.getSurvey().attrs };
  };

  getSurvey() {
    const survey = surveyConfig;

    if (!survey) {
      throw new Error('No survey config was found');
    }

    if (this.parent) {
      return survey.smp;
    }

    return survey;
  }

  getSpecies() {
    if (!this.parent) {
      throw new Error('Parent does not exist');
    }

    const [occ] = this.occurrences;

    if (!occ.media[0].attrs.species) {
      return null;
    }

    const { speciesId } = occ.attrs;
    return occ.media[0].attrs.species[speciesId];
  }

  getAllSpecies() {
    if (!this.parent) {
      throw new Error('Parent does not exist');
    }

    return this.occurrences[0].media[0].attrs.species;
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
    const selectedSeedmix = seedmixData[seedmix];
    if (!selectedSeedmix) {
      return [[]];
    }

    const extractLatinName = ({ latin_name }) => latin_name; // eslint-disable-line camelcase
    const selectedSeedmixLatinNames = selectedSeedmix.map(extractLatinName);

    const seedmixIncludesSpecies = ([scientificName]) =>
      selectedSeedmixLatinNames.includes(scientificName);

    const species = this.getUniqueSpecies();
    const selectedSeedmixSpecies = species.filter(seedmixIncludesSpecies);

    return [selectedSeedmixSpecies, selectedSeedmix];
  }

  isDisabled() {
    if (this.parent) {
      return this.parent.isDisabled();
    }

    return !!this.metadata.synced_on;
  }
}

export default AppSample;
