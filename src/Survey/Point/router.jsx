import React from 'react';
import { RouteWithModels, AttrPage as Attr, ModelLocation } from '@flumens';
import savedSamples from 'models/savedSamples';
import appModel from 'models/app';
import userModel from 'models/user';
import config from 'common/config';
import StartNewSurvey from 'Survey/common/Components/StartNewSurvey';
import TaxonSearch from 'Survey/common/Components/TaxonSearch';
import EditSpecies from 'Survey/common/Components/EditSpecies';
import Home from './Home';
import Report from './Report';
import survey from './config';

const baseURL = '/survey/point';

const HomeWrap = props => (
  <Home appModel={appModel} userModel={userModel} {...props} />
);

const ReportWrap = props => <Report appModel={appModel} {...props} />;

const ModelLocationWrap = props => (
  <ModelLocation
    appModel={appModel}
    mapProviderOptions={config.map}
    useGridRef
    useGridMap
    {...props}
  />
);

const routes = [
  [`${baseURL}`, StartNewSurvey.with(survey), true],
  [`${baseURL}/:smpId`, HomeWrap],
  [`${baseURL}/:smpId/:attr`, Attr],
  [`${baseURL}/:smpId/map`, ModelLocationWrap],
  [`${baseURL}/:smpId/taxon`, TaxonSearch],
  [`${baseURL}/:smpId/species/:subSmpId`, EditSpecies],
  [`${baseURL}/:smpId/species/:subSmpId/taxon`, TaxonSearch],
  [`${baseURL}/:smpId/report`, ReportWrap],
];

export default RouteWithModels.fromArray(savedSamples, routes);
