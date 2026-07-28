import { RouteWithModels, AttrPage } from '@flumens';
import samples from 'models/collections/samples';
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

const routes = [
  [baseURL, StartNewSurvey.with(survey), true],
  [`${baseURL}/:smpId`, Home],
  [`${baseURL}/:smpId/:attr`, AttrPageFromRoute],
  [`${baseURL}/:smpId/traps`, Traps],
  [`${baseURL}/:smpId/traps/date`, AttrPageFromRoute],
  [`${baseURL}/:smpId/traps/map`, ModelLocationMap.SampleFromRoute],
  [
    `${baseURL}/:smpId/traps/${fieldNonCropHabitatsAttr.id}`,
    ({ sample }: any) => (
      <AttrPage.BlockPage
        record={sample.data}
        block={fieldNonCropHabitatsAttr}
      />
    ),
  ],
  [`${baseURL}/:smpId/trap/:subSmpId`, Trap],
  [`${baseURL}/:smpId/trap/:subSmpId/:attr`, AttrPageFromRoute],
  [`${baseURL}/:smpId/trap/:subSmpId/map`, ModelLocationMap.SampleFromRoute],
  [`${baseURL}/:smpId/trap/:subSmpId/occurrence/:occId`, Occurrence],
  [
    `${baseURL}/:smpId/trap/:subSmpId/occurrence/:occId/:attr`,
    AttrPageFromRoute,
  ],
  [`${baseURL}/:smpId/trap/:subSmpId/occurrence/:occId/species`, EditSpecies],
  // [`${baseURL}/:smpId/report`, Report],
];

export default RouteWithModels.fromArray(samples as any, routes);
