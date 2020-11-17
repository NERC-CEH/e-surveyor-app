import React from 'react';
import { RouteWithModels, AttrPage as Attr } from '@apps';
import savedSamples from 'savedSamples';
import appModel from 'appModel';
import StartNewSurvey from './StartNewSurvey';
import Edit from './Edit';
import Report from './Report';
import survey from './config';

const baseURL = '/survey';

const EditWrap = props => (
  <Edit appModel={appModel} savedSamples={savedSamples} {...props} />
);

const ReportWrap = props => (
  <Report savedSamples={savedSamples} appModel={appModel} {...props} />
);

const routes = [
  [`${baseURL}`, StartNewSurvey.with(survey), true],
  [`${baseURL}/:smpId/edit`, EditWrap],
  [`${baseURL}/:smpId/edit/:attr`, Attr],
  [`${baseURL}/:smpId/report`, ReportWrap],
];

export default RouteWithModels.fromArray(savedSamples, routes);
