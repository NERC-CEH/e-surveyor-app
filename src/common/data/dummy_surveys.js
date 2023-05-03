import Sample from 'models/sample';
import surveysData from './cacheRemote/dummy_surveys.json';
import species from './cacheRemote/species.json';
import surveysNamesData from './dummy_surveys_names.json';

const { getUniqueSupportedSpecies } = Sample;

const surveys = [];

const normalizeSpeciesName = name => {
  const latinName = ({ pn_latin_name: PNLatinName }) => PNLatinName === name;

  const fullSpeciesInfo = species.find(latinName) || {};

  return fullSpeciesInfo.latin_name;
};

const aggregateBySurveyId = ({ species: name, survey }) => {
  const surveyId = survey - 1;
  const getNewSurveyObject = () => ({
    name: surveysNamesData[surveyId],
    species: [],
    pollinators: 0,
  });

  surveys[surveyId] || (surveys[surveyId] = getNewSurveyObject());

  const normalisedName = normalizeSpeciesName(name);
  if (normalisedName) {
    surveys[surveyId].species.push(normalisedName);
  }
};

surveysData.forEach(aggregateBySurveyId);

const addSpeciesToArray = sp => [sp];

const addPollinationCounts = survey => {
  const normalisedSpeciesArray = survey.species.map(addSpeciesToArray);
  const pollinators = getUniqueSupportedSpecies(normalisedSpeciesArray).length;

  return { ...survey, pollinators };
};

export default surveys.map(addPollinationCounts);
