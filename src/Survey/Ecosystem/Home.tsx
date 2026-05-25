import { Header, Main, Page } from 'common/flumens';
import SurveyCard from 'Survey/common/Components/SurveyCard';
import beetleSurvey from './Beetle/config';
import mothSurvey from './Moth/config';

const EcosystemHome = () => (
  <Page id="ecosystem-home">
    <Header title="Ecosystem Function" />
    <Main>
      <div className="p-3 flex flex-col gap-4">
        <div>
          Measure biodiversity within habitats by recording moths, beetles and
          day-time pollinators.
        </div>

        <SurveyCard
          header="Night-time Pollinators"
          description="Survey moths and other nocturnal pollinators."
          link={mothSurvey.baseURL}
        />

        <SurveyCard
          header="Ground Beetles (Carabids)"
          description="Trap and record ground beetles."
          link={beetleSurvey.baseURL}
        />

        <SurveyCard
          header="Day-time Pollinators"
          description="Survey beetles, bees and other pollinators during the day. Coming soon..."
        />
      </div>
    </Main>
  </Page>
);

export default EcosystemHome;
