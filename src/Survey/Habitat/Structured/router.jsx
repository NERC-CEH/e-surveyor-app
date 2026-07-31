import { RouteWithModels, AttrPage } from '@flumens';
import samples from 'models/collections/samples';
import Locations from 'Components/Locations';
import ModelLocationMap from 'Survey/common/Components/ModelLocationMap';
import StartNewSurvey from 'Survey/common/Components/StartNewSurvey';
import TaxonSearch from 'Survey/common/Components/TaxonSearch';
import Home from './Home';
import Occurrence from './Occurrence';
import Quadrat from './Quadrat';
import Quadrats from './Quadrats';
import survey from './config';

const { baseURL } = survey;

const { AttrPageFromRoute } = AttrPage;

const routes = [
  [`${baseURL}`, StartNewSurvey.with(survey), true],
  [`${baseURL}/:smpId`, Home],
  [`${baseURL}/:smpId/:attr`, AttrPageFromRoute],
  [`${baseURL}/:smpId/location`, Locations],
  [`${baseURL}/:smpId/quadrats`, Quadrats],
  [`${baseURL}/:smpId/quadrats/:attr`, AttrPageFromRoute],
  [`${baseURL}/:smpId/quadrats/map`, ModelLocationMap.SampleFromRoute],
  [`${baseURL}/:smpId/quadrats/quadrat/:subSmpId`, Quadrat],
  [
    `${baseURL}/:smpId/quadrats/quadrat/:subSmpId/map`,
    ModelLocationMap.SampleFromRoute,
  ],
  [`${baseURL}/:smpId/quadrats/quadrat/:subSmpId/taxon`, TaxonSearch],
  [`${baseURL}/:smpId/quadrats/quadrat/:subSmpId/species/:occId`, Occurrence],
  [
    `${baseURL}/:smpId/quadrats/quadrat/:subSmpId/species/:occId/taxon`,
    TaxonSearch,
  ],
];

export default RouteWithModels.fromArray(samples, routes);
