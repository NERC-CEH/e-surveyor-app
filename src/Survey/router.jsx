import React from 'react';
import { RouteWithModels, AttrPage as Attr, ModelLocation } from '@apps';
import savedSamples from 'savedSamples';
import appModel from 'appModel';
import userModel from 'userModel';
import config from 'config';
import StartNewSurvey from './StartNewSurvey';
import Edit from './Edit';
import Report from './Report';
import EditSpecies from './EditSpecies';
import TaxonSearch from './TaxonSearch';
import survey from './config';

const baseURL = '/survey';

const EditWrap = props => (
  <Edit appModel={appModel} savedSamples={savedSamples} {...props} />
);

const ReportWrap = props => (
  <Report
    savedSamples={savedSamples}
    appModel={appModel}
    userModel={userModel}
    {...props}
  />
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
  [`${baseURL}/:smpId/edit`, EditWrap],
  [`${baseURL}/:smpId/edit/:attr`, Attr],
  [`${baseURL}/:smpId/edit/map`, ModelLocationWrap],
  [`${baseURL}/:smpId/edit/taxon`, TaxonSearch],
  [`${baseURL}/:smpId/edit/species/:subSmpId`, EditSpecies],
  [`${baseURL}/:smpId/edit/species/:subSmpId/taxon`, TaxonSearch],
  [`${baseURL}/:smpId/report`, ReportWrap],
];

export default RouteWithModels.fromArray(savedSamples, routes);
