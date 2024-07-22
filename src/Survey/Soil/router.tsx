import { RouteWithModels, AttrPage } from '@flumens';
import savedSamples from 'models/savedSamples';
import ModelLocationMap from 'Survey/common/Components/ModelLocationMap';
import StartNewSurvey from 'Survey/common/Components/StartNewSurvey';
import Home from './Home';
import Management from './Management';
import Report from './Report';
import SOMHome from './SOM/Home';
import SOMLab from './SOM/Lab';
import SOMList from './SOM/List';
import VSAHome from './VSA/Home';
import VSAList from './VSA/List';
import WormHome from './Worms/Home';
import WormList from './Worms/List';
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
  [`${baseURL}/:smpId/vsa`, VSAList],
  [`${baseURL}/:smpId/vsa/:subSmpId`, VSAHome],
  [`${baseURL}/:smpId/vsa/:subSmpId/:attr`, AttrPageFromRoute],
  [`${baseURL}/:smpId/vsa/:subSmpId/location`, ModelLocationMap],
  [`${baseURL}/:smpId/worms`, WormList],
  [`${baseURL}/:smpId/worms/:subSmpId`, WormHome],
  [`${baseURL}/:smpId/worms/:subSmpId/location`, ModelLocationMap],
  [`${baseURL}/:smpId/som`, SOMList],
  [`${baseURL}/:smpId/som/:subSmpId`, SOMHome],
  [`${baseURL}/:smpId/som/:subSmpId/location`, ModelLocationMap],
  [`${baseURL}/:smpId/som/lab`, SOMLab],
];

export default RouteWithModels.fromArray(savedSamples, routes);
