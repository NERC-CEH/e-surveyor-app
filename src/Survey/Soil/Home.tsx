import { useState } from 'react';
import { Header, Main, Page } from 'common/flumens';
import soilIcon from 'common/images/soil.svg';
import StarsBackground from 'Survey/common/Components/StarsBackground';
import SurveyCard from 'Survey/common/Components/SurveyCard';

const SoilHome = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  return (
    <Page id="soil-home" className="theme-soil">
      <Header
        title="Soil"
        className={`stars-background-header ${isScrolled ? 'header-scrolled' : ''}`}
      />
      <Main
        fullscreen
        scrollEvents
        onIonScroll={event => {
          setIsScrolled(event.detail.scrollTop > 70);
        }}
      >
        <StarsBackground>
          Assess below-ground condition and resilience.
        </StarsBackground>
        <div className="p-3 flex flex-col gap-4">
          <SurveyCard
            header="Physical Condition"
            description={
              <>
                Evaluate soil compaction, structure and erosion.
                <ul className="list-disc list-inside mt-2">
                  <li>
                    Assess below-ground soil compaction using a soil tool.
                  </li>
                  <li>Check soil structure for aggregation and porosity.</li>
                  <li>
                    Test soil surface for signs of erosion and water
                    infiltration.
                  </li>
                </ul>
              </>
            }
            className="-mt-8"
            icon={soilIcon}
          />

          <SurveyCard
            header="Organic Matter & Chemistry"
            description="Measure organic matter levels and basic soil chemistry."
            icon={soilIcon}
          />

          <SurveyCard
            header="Biological Activity"
            description="Assess soil organisms and decomposition activity."
            icon={soilIcon}
          />
        </div>
      </Main>
    </Page>
  );
};

export default SoilHome;
