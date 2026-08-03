import { Route } from 'react-router-dom';
import { AttrPage, withSample } from '@flumens';
import Locations from 'Components/Locations';
import StartNewSurvey from 'Survey/common/Components/StartNewSurvey';
import TaxonSearch from 'Survey/common/Components/TaxonSearch';
import Home from './Home';
import Occurrence from './Occurrence';
import Report from './Report';
import survey from './config';

const { baseURL } = survey;

const { AttrPageFromRoute } = AttrPage;

const routes = (
  [
    [baseURL, StartNewSurvey.with(survey)],
    [`${baseURL}/:smpId`, Home],
    [`${baseURL}/:smpId/:attr`, withSample(AttrPageFromRoute)],
    [`${baseURL}/:smpId/location`, Locations],
    [`${baseURL}/:smpId/taxon`, TaxonSearch],
    [`${baseURL}/:smpId/species/:occId`, Occurrence],
    [`${baseURL}/:smpId/species/:occId/taxon`, TaxonSearch],
    [`${baseURL}/:smpId/report`, Report],
  ] as any[]
).map(([route, component]) => (
  <Route key={route} exact path={route} component={component} />
));

export default routes;
