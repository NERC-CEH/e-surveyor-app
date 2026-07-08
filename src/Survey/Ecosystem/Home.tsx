import { useState } from 'react';
import { Header, Main, Page } from 'common/flumens';
import beeIcon from 'common/images/bee.svg';
import StarsBackground from 'Survey/common/Components/StarsBackground';
import SurveyCard from 'Survey/common/Components/SurveyCard';
import beetleSurvey from './Beetle/config';
import mothSurvey from './Moth/config';

const EcosystemHome = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  return (
    <Page id="ecosystem-home" className="theme-ecosystem">
      <Header
        title="Ecosystem Function"
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
          Measure biodiversity within habitats by recording moths, beetles and
          day-time pollinators.
        </StarsBackground>
        <div className="p-3 flex flex-col gap-4">
          <SurveyCard
            header="Moths"
            description={
              <>
                Survey moths and other nocturnal pollinators.
                <ul className="list-disc list-inside mt-2">
                  <li>Record moths at night using a light trap</li>
                  <li>AI-assisted moth identification included</li>
                  <li>
                    <b>Survey ideally</b> takes place one hour after sunset for
                    about 20-40 minutes
                  </li>
                </ul>
              </>
            }
            link={mothSurvey.baseURL}
            className="-mt-8"
            icon={mothSurvey.icon}
          />

          <SurveyCard
            header="Ground Beetles (Carabids)"
            description="Trap and record ground beetles."
            link={beetleSurvey.baseURL}
            icon={beetleSurvey.icon}
          />

          <SurveyCard
            header="Day-time Pollinators"
            description="Survey beetles, bees and other pollinators during the day."
            icon={beeIcon}
          />
        </div>
      </Main>
    </Page>
  );
};

export default EcosystemHome;
