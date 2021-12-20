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
import Details from './Details';
import Quadrat from './Quadrat';
import Report from './Report';
import survey from './config';

const baseURL = '/survey/transect';

const HomeWrap = props => (
  <Home appModel={appModel} userModel={userModel} {...props} />
);

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
  [`${baseURL}/:smpId/details`, Details],
  [`${baseURL}/:smpId/details/:attr`, Attr],
  [`${baseURL}/:smpId/details/map`, ModelLocationWrap],
  [`${baseURL}/:smpId/quadrat/:subSmpId`, Quadrat],
  [`${baseURL}/:smpId/quadrat/:subSmpId/map`, ModelLocationWrap],
  [`${baseURL}/:smpId/quadrat/:subSmpId/taxon`, TaxonSearch],
  [`${baseURL}/:smpId/quadrat/:subSmpId/species/:subSubSmpId`, EditSpecies],
  [
    `${baseURL}/:smpId/quadrat/:subSmpId/species/:subSubSmpId/taxon`,
    TaxonSearch,
  ],
  [`${baseURL}/:smpId/report`, Report],
];

export default RouteWithModels.fromArray(savedSamples, routes);
