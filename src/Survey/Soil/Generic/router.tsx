import { Route } from 'react-router-dom';
import { AttrPage, withSample } from '@flumens';
import ModelLocationMap from 'Survey/common/Components/ModelLocationMap';
import StartNewSurvey from 'Survey/common/Components/StartNewSurvey';
import Home from './Home';
import Management from './Management';
import PastSampleMap from './PastSampleMap';
import Report from './Report';
import SOM from './SOM';
import Lab from './SOM/Lab';
import Nutrient from './SOM/Lab/Nutrient';
import Texture from './SOM/Lab/Texture';
import SampleHome from './Sample';
import VSA from './Sample/VSA';
import Worms from './Sample/Worms';
import survey from './config';

const { AttrPageFromRoute } = AttrPage;
const { baseURL } = survey;

const routes = [
  [baseURL, StartNewSurvey.with(survey)],
  [`${baseURL}/:smpId`, Home],
  [`${baseURL}/:smpId/:attr`, withSample(AttrPageFromRoute)],
  [`${baseURL}/:smpId/location`, ModelLocationMap.SampleFromRoute],
  [`${baseURL}/:smpId/past-locations`, PastSampleMap],
  [`${baseURL}/:smpId/report`, Report],
  [`${baseURL}/:smpId/management`, Management],
  [`${baseURL}/:smpId/management/:attr`, withSample(AttrPageFromRoute)],
  [`${baseURL}/:smpId/som`, SOM],
  [`${baseURL}/:smpId/som/:attr`, withSample(AttrPageFromRoute)],
  [`${baseURL}/:smpId/som/lab`, Lab],
  [`${baseURL}/:smpId/som/lab/texture`, Texture],
  [`${baseURL}/:smpId/som/lab/nutrient`, Nutrient],
  [`${baseURL}/:smpId/sample/:subSmpId`, SampleHome],
  [
    `${baseURL}/:smpId/sample/:subSmpId/location`,
    ModelLocationMap.SampleFromRoute,
  ],
  [`${baseURL}/:smpId/sample/:subSmpId/worms`, Worms],
  [`${baseURL}/:smpId/sample/:subSmpId/vsa`, VSA],
  [
    `${baseURL}/:smpId/sample/:subSmpId/vsa/:attr`,
    withSample(AttrPageFromRoute),
  ],
] as any[];

const mappedRoutes = routes.map(([route, component]) => (
  <Route key={route} exact path={route} component={component} />
));

export default mappedRoutes;
