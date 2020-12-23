import React from 'react';
import { RouteWithModels, AttrPage as Attr, ModelLocation } from '@apps';
import savedSamples from 'savedSamples';
import appModel from 'appModel';
import userModel from 'userModel';
import config from 'config';
import StartNewSurvey from 'Survey/Components/StartNewSurvey';
import Edit from './Edit';
import Report from './Report';
import EditSpecies from './EditSpecies';
import TaxonSearch from './TaxonSearch';
import survey from './config';

const baseURL = '/survey/point';

const EditWrap = props => (
  <Edit
    appModel={appModel}
    savedSamples={savedSamples}
    userModel={userModel}
    {...props}
  />
);

const ReportWrap = props => (
  <Report savedSamples={savedSamples} appModel={appModel} {...props} />
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
  [`${baseURL}/:smpId`, EditWrap],
  [`${baseURL}/:smpId/:attr`, Attr],
  [`${baseURL}/:smpId/map`, ModelLocationWrap],
  [`${baseURL}/:smpId/taxon`, TaxonSearch],
  [`${baseURL}/:smpId/species/:subSmpId`, EditSpecies],
  [`${baseURL}/:smpId/species/:subSmpId/taxon`, TaxonSearch],
  [`${baseURL}/:smpId/report`, ReportWrap],
];

export default RouteWithModels.fromArray(savedSamples, routes);
