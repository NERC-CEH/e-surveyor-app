import { RouteWithModels, AttrPage } from '@flumens';
import appModel from 'models/app';
import samples from 'models/collections/samples';
import userModel from 'models/user';
import EditSpecies from 'Components/Species';
import ModelLocationMap from 'Survey/common/Components/ModelLocationMap';
import StartNewSurvey from 'Survey/common/Components/StartNewSurvey';
import TaxonSearch from 'Survey/common/Components/TaxonSearch';
import Details from './Details';
import Home from './Home';
import Quadrat from './Quadrat';
import Report from './Report';
import survey from './config';

const baseURL = '/survey/transect';

const { AttrPageFromRoute } = AttrPage;

const HomeWrap = props => (
  <Home appModel={appModel} userModel={userModel} {...props} />
);

const routes = [
  [`${baseURL}`, StartNewSurvey.with(survey), true],
  [`${baseURL}/:smpId`, HomeWrap],
  [`${baseURL}/:smpId/:attr`, AttrPageFromRoute],
  [`${baseURL}/:smpId/details`, Details],
  [`${baseURL}/:smpId/details/:attr`, AttrPageFromRoute],
  [`${baseURL}/:smpId/details/map`, ModelLocationMap],
  [`${baseURL}/:smpId/quadrat/:subSmpId`, Quadrat],
  [`${baseURL}/:smpId/quadrat/:subSmpId/map`, ModelLocationMap],
  [`${baseURL}/:smpId/quadrat/:subSmpId/taxon`, TaxonSearch],
  [`${baseURL}/:smpId/quadrat/:subSmpId/species/:subSubSmpId`, EditSpecies],
  [
    `${baseURL}/:smpId/quadrat/:subSmpId/species/:subSubSmpId/taxon`,
    TaxonSearch,
  ],
  [`${baseURL}/:smpId/report`, Report],
];

export default RouteWithModels.fromArray(samples, routes);
