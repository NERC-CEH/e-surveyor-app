import { RouteWithModels, AttrPage, ModelLocationMap } from '@flumens';
import config from 'common/config';
import appModel from 'models/app';
import savedSamples from 'models/savedSamples';
import StartNewSurvey from 'Survey/common/Components/StartNewSurvey';
import Details from './Details';
import EditSpecies from './EditSpecies';
import Home from './Home';
import Trap from './Trap';
import survey from './config';

const baseURL = `/survey/${survey.name}`;

const { AttrPageFromRoute } = AttrPage;

const ModelLocationWrap = (props: any) => (
  <ModelLocationMap
    appModel={appModel}
    mapProviderOptions={config.map}
    backButtonProps={{ text: 'Back' }}
    useGridRef
    useGridMap
    model={props.subSample || props.sample}
    {...props}
  />
);

const routes = [
  [`${baseURL}`, StartNewSurvey.with(survey), true],
  [`${baseURL}/:smpId`, Home],
  [`${baseURL}/:smpId/:attr`, AttrPageFromRoute],
  [`${baseURL}/:smpId/details`, Details],
  [`${baseURL}/:smpId/details/:attr`, AttrPageFromRoute],
  [`${baseURL}/:smpId/details/map`, ModelLocationWrap],
  [`${baseURL}/:smpId/trap/:subSmpId`, Trap],
  [`${baseURL}/:smpId/trap/:subSmpId/:attr`, AttrPageFromRoute],
  [`${baseURL}/:smpId/trap/:subSmpId/map`, ModelLocationWrap],
  [`${baseURL}/:smpId/trap/:subSmpId/species/:occId`, EditSpecies],
  // [`${baseURL}/:smpId/report`, Report],
];

export default RouteWithModels.fromArray(savedSamples, routes);
