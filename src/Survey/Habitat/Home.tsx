import { Header, Main, Page } from 'common/flumens';
import SurveyCard from 'Survey/common/Components/SurveyCard';
import pointSurvey from './Point/config';
import transectSurvey from './Transect/config';

const HabitatHome = () => (
  <Page id="habitat-home">
    <Header title="Habitat" />
    <Main>
      <div className="p-3 flex flex-col gap-4">
        <div>
          Record habitat type, composition and structure to describe what is
          present on site.
        </div>

        <SurveyCard
          header="Site Location"
          description="This survey captures the location of your monitoring site, including its position within the landscape. All other surveys are linked to this location, ensuring consistent and georeferenced data. Coming soon..."
        />

        <SurveyCard
          header="Habitat Composition"
          description="Record plant species present and describe the make-up of the habitat."
          link={pointSurvey.baseURL}
        />

        <SurveyCard
          header="Habitat Structure"
          description="Record structural features, such as height, layers and physical complexity."
          link={transectSurvey.baseURL}
        />
      </div>
    </Main>
  </Page>
);

export default HabitatHome;
