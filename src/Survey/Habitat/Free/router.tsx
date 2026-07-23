import { RouteWithModels, AttrPage } from '@flumens';
import samples from 'models/collections/samples';
import Locations from 'Components/Locations';
import EditSpecies from 'Components/Species';
import StartNewSurvey from 'Survey/common/Components/StartNewSurvey';
import TaxonSearch from 'Survey/common/Components/TaxonSearch';
import Home from './Home';
import Report from './Report';
import survey from './config';

const { baseURL } = survey;

const { AttrPageFromRoute } = AttrPage;

const routes = [
  [baseURL, StartNewSurvey.with(survey), true],
  [`${baseURL}/:smpId`, Home],
  [`${baseURL}/:smpId/:attr`, AttrPageFromRoute],
  [`${baseURL}/:smpId/location`, Locations],
  [`${baseURL}/:smpId/taxon`, TaxonSearch],
  [`${baseURL}/:smpId/species/:subSmpId`, EditSpecies],
  [`${baseURL}/:smpId/species/:subSmpId/taxon`, TaxonSearch],
  [`${baseURL}/:smpId/report`, Report],
];

export default RouteWithModels.fromArray(samples as any, routes);
