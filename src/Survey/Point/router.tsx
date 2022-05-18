import { RouteWithModels, AttrPage, ModelLocationMap } from '@oldBit';
import savedSamples from 'models/savedSamples';
import appModel from 'models/app';
import config from 'common/config';
import StartNewSurvey from 'Survey/common/Components/StartNewSurvey';
import TaxonSearch from 'Survey/common/Components/TaxonSearch';
import EditSpecies from 'Components/Species';
import Home from './Home';
import Report from './Report';
import survey from './config';

const baseURL = '/survey/point';

const { AttrPageFromRoute } = AttrPage;

const ModelLocationWrap = (props: any) => (
  <ModelLocationMap
    appModel={appModel}
    mapProviderOptions={config.map}
    useGridRef
    useGridMap
    model={props.sample}
    {...props}
  />
);

const routes = [
  [`${baseURL}`, StartNewSurvey.with(survey), true],
  [`${baseURL}/:smpId`, Home],
  [`${baseURL}/:smpId/:attr`, AttrPageFromRoute],
  [`${baseURL}/:smpId/map`, ModelLocationWrap],
  [`${baseURL}/:smpId/taxon`, TaxonSearch],
  [`${baseURL}/:smpId/species/:subSmpId`, EditSpecies],
  [`${baseURL}/:smpId/species/:subSmpId/taxon`, TaxonSearch],
  [`${baseURL}/:smpId/report`, Report],
];

export default RouteWithModels.fromArray(savedSamples, routes);
