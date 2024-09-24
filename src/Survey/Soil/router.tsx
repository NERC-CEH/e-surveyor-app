import { RouteWithModels, AttrPage } from '@flumens';
import savedSamples from 'models/savedSamples';
import ModelLocationMap from 'Survey/common/Components/ModelLocationMap';
import StartNewSurvey from 'Survey/common/Components/StartNewSurvey';
import Home from './Home';
import Management from './Management';
import Report from './Report';
import SOM from './SOM';
import Lab from './SOM/Lab';
import SampleHome from './Sample';
import VSA from './Sample/VSA';
import Worms from './Sample/Worms';
import survey from './config';

const { AttrPageFromRoute } = AttrPage;
const baseURL = `/survey/${survey.name}`;

const routes = [
  [`${baseURL}`, StartNewSurvey.with(survey), true],
  [`${baseURL}/:smpId`, Home],
  [`${baseURL}/:smpId/:attr`, AttrPageFromRoute],
  [`${baseURL}/:smpId/location`, ModelLocationMap],
  [`${baseURL}/:smpId/report`, Report],
  [`${baseURL}/:smpId/management`, Management],
  [`${baseURL}/:smpId/management/:attr`, AttrPageFromRoute],
  [`${baseURL}/:smpId/som`, SOM],
  [`${baseURL}/:smpId/som/:attr`, AttrPageFromRoute],
  [`${baseURL}/:smpId/som/lab`, Lab],
  [`${baseURL}/:smpId/sample/:subSmpId`, SampleHome],
  [`${baseURL}/:smpId/sample/:subSmpId/location`, ModelLocationMap],
  [`${baseURL}/:smpId/sample/:subSmpId/worms`, Worms],
  [`${baseURL}/:smpId/sample/:subSmpId/vsa`, VSA],
  [`${baseURL}/:smpId/sample/:subSmpId/vsa/:attr`, AttrPageFromRoute],
];

export default RouteWithModels.fromArray(savedSamples, routes);
