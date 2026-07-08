import { useState } from 'react';
import { locationOutline, stopwatchOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';
import { Header, Main, Page } from 'common/flumens';
import StarsBackground from 'Survey/common/Components/StarsBackground';
import SurveyCard from 'Survey/common/Components/SurveyCard';
import locationSurvey from './Location/config';
import pointSurvey from './Point/config';
import transectSurvey from './Transect/config';

const HabitatHome = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  return (
    <Page id="habitat-home" className="theme-habitat">
      <Header
        title="Habitat"
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
          Record habitat type, composition and structure to describe what is
          present on site.
        </StarsBackground>
        <div className="p-3 flex flex-col gap-4">
          <SurveyCard
            header="Location"
            description={
              <>
                This survey captures the location of your monitoring site,
                including its position within the landscape. All other surveys
                are linked to this location, ensuring consistent and
                georeferenced data.
                <div className="flex flex-col gap-2 mt-2">
                  <div>
                    <IonIcon
                      icon={locationOutline}
                      className="text-lg mr-2 -mb-1"
                    />
                    Recorded once per site, and updated if the survey location
                    changes
                  </div>
                  <div>
                    <IonIcon
                      icon={stopwatchOutline}
                      className="text-lg mr-2 -mb-1"
                    />
                    Takes about 1-2 minutes
                  </div>
                </div>
              </>
            }
            className="-mt-8"
            link={locationSurvey.baseURL}
            icon={locationSurvey.icon}
          />

          <SurveyCard
            header="Habitat Composition"
            description="Record plant species present and describe the make-up of the habitat."
            link={pointSurvey.baseURL}
            icon={pointSurvey.icon}
          />

          <SurveyCard
            header="Habitat Structure"
            description="Record structural features, such as height, layers and physical complexity."
            link={transectSurvey.baseURL}
            icon={transectSurvey.icon}
          />
        </div>
      </Main>
    </Page>
  );
};

export default HabitatHome;
