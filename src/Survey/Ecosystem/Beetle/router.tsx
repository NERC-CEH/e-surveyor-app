import { Route } from 'react-router-dom';
import { AttrPage, useSample, withSample } from '@flumens';
import Sample from 'models/sample';
import ModelLocationMap from 'Survey/common/Components/ModelLocationMap';
import StartNewSurvey from 'Survey/common/Components/StartNewSurvey';
import EditSpecies from './EditSpecies';
import Home from './Home';
import Occurrence from './Occurrence';
import Trap from './Trap';
import Traps from './Traps';
import survey, { fieldNonCropHabitatsAttr } from './config';

const { baseURL } = survey;

const { AttrPageFromRoute } = AttrPage;

const FieldNonCropHabitatsPage = () => {
  const { sample } = useSample<Sample>();
  if (!sample) throw new Error('Sample is missing');

  return (
    <AttrPage.BlockPage record={sample.data} block={fieldNonCropHabitatsAttr} />
  );
};

const routes = [
  [baseURL, StartNewSurvey.with(survey)],
  [`${baseURL}/:smpId`, Home],
  [`${baseURL}/:smpId/:attr`, withSample(AttrPageFromRoute)],
  [`${baseURL}/:smpId/traps`, Traps],
  [`${baseURL}/:smpId/traps/date`, withSample(AttrPageFromRoute)],
  [`${baseURL}/:smpId/traps/map`, ModelLocationMap.SampleFromRoute],
  [
    `${baseURL}/:smpId/traps/${fieldNonCropHabitatsAttr.id}`,
    FieldNonCropHabitatsPage,
  ],
  [`${baseURL}/:smpId/trap/:subSmpId`, Trap],
  [`${baseURL}/:smpId/trap/:subSmpId/:attr`, withSample(AttrPageFromRoute)],
  [`${baseURL}/:smpId/trap/:subSmpId/map`, ModelLocationMap.SampleFromRoute],
  [`${baseURL}/:smpId/trap/:subSmpId/occurrence/:occId`, Occurrence],
  [
    `${baseURL}/:smpId/trap/:subSmpId/occurrence/:occId/:attr`,
    withSample(AttrPageFromRoute),
  ],
  [`${baseURL}/:smpId/trap/:subSmpId/occurrence/:occId/species`, EditSpecies],
  // [`${baseURL}/:smpId/report`, Report],
] as any[];

const mappedRoutes = routes.map(([route, component]) => (
  <Route key={route} exact path={route} component={component} />
));

export default mappedRoutes;
