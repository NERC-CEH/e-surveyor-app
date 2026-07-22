import { locationOutline, stopwatchOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';
import { Header, Main, Page } from 'common/flumens';
import useHeaderScroll from 'helpers/useHeaderScroll';
import StarsBackground from 'Survey/common/Components/StarsBackground';
import SurveyCard from 'Survey/common/Components/SurveyCard';
import pointSurvey from './Free/config';
import locationSurvey from './Location/config';
import transectSurvey from './Structured/config';

const HabitatHome = () => {
  const { isScrolled, ...mainProps } = useHeaderScroll();

  return (
    <Page id="habitat-home" className="theme-habitat">
      <Header
        title="Habitat"
        className={`stars-background-header ${isScrolled ? 'header-scrolled' : ''}`}
      />
      <Main {...mainProps}>
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
            header="Free Sampling"
            description={
              <>
                Record your habitat freely and record any plant species you
                find.
                <div className="border-t border-neutral-100 mt-3 pt-3">
                  <b>Best for:</b> general biodiversity, learning about your
                  land, spotting interesting plants.
                </div>
              </>
            }
            link={pointSurvey.baseURL}
            icon={pointSurvey.icon}
          />

          <SurveyCard
            header="Structured Sampling"
            description={
              <>
                Follow a set layout using quadrats along a transect to record
                plants systematically.
                <div className="border-t border-neutral-100 mt-3 pt-3">
                  <b>Best for:</b> repeat monitoring, tracking change over time,
                  projects and agri-environment schemes.
                </div>
              </>
            }
            link={transectSurvey.baseURL}
            icon={transectSurvey.icon}
          />
        </div>
      </Main>
    </Page>
  );
};

export default HabitatHome;
