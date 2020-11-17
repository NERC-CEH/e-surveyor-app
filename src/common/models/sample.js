import { Sample } from '@apps';
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

  store = modelStore;

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

  getUniqueSpecies() {
    const getScientificName = imageModel =>
      !imageModel.attrs.species
        ? null
        : imageModel.attrs.species.scientificNameWithoutAuthor;

    let list = this.media.map(getScientificName).filter(species => species);

    const uniqueSpeciesScientificNames = [...new Set(list)];

    const extractUniqueScientificNames = name => {
      const scientificName = image => getScientificName(image) === name;

      const fullSpecies = this.media.find(scientificName);

      let commonName;

      if (
        fullSpecies.attrs.species.commonNames &&
        fullSpecies.attrs.species.commonNames.length
      ) {
        [commonName] = fullSpecies.attrs.species.commonNames;
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

  isDisabled() {
    if (this.parent) {
      return this.parent.isDisabled();
    }

    return !!this.metadata.synced_on;
  }
}

AppSample.prototype = Object.assign(AppSample.prototype);
AppSample.prototype.constructor = AppSample;

export default AppSample;
