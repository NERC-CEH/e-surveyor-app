import { Header, Main, Page } from 'common/flumens';
import SurveyCard from 'Survey/common/Components/SurveyCard';

const SoilHome = () => (
  <Page id="soil-home">
    <Header title="Soil" />
    <Main>
      <div className="p-3 flex flex-col gap-4">
        <div>Assess below-ground condition and resilience.</div>

        <SurveyCard
          header="Physical Condition"
          description="Evaluate soil compaction, structure and erosion. Coming soon..."
        />

        <SurveyCard
          header="Organic Matter & Chemistry"
          description="Measure organic matter levels and basic soil chemistry. Coming soon..."
        />

        <SurveyCard
          header="Biological Activity"
          description="Assess soil organisms and decomposition activity. Coming soon..."
        />
      </div>
    </Main>
  </Page>
);

export default SoilHome;
