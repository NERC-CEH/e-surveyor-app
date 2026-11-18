import { useContext } from 'react';
import { useLocation } from 'react-router';
import { Button, Header, InfoMessage, Main, Page } from '@flumens';
import { NavContext } from '@ionic/react';
import VideoCard from 'common/Components/VideoCard';
import { MOTH_VIDEOS } from 'common/videos';
import survey from './config';

const MothVideos = () => {
  const { state } = useLocation<{ fromSurvey?: boolean } | undefined>();
  const { navigate } = useContext(NavContext);

  return (
    <Page id="moth-videos" className="theme-ecosystem">
      <Header
        title="Moth survey: how-to videos"
        defaultHref="/survey/ecosystem"
      />
      <Main>
        <div className="mx-auto max-w-xl space-y-4 p-4 pb-8">
          <InfoMessage color="tertiary">
            <p className="m-0">
              This survey helps you record moths using an LED trap and the
              e-Surveyor app. You don't need any prior knowledge: the app will
              guide you.
            </p>
            <p className="mt-2 mb-0">
              Optional. Watch any of these before or during your survey.
            </p>
          </InfoMessage>

          {MOTH_VIDEOS.map((video, index) => (
            <section
              key={video.src}
              aria-label={video.title}
              className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm"
            >
              <h2 className="mt-0 flex items-center gap-2 text-lg font-semibold pb-2!">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary-800 text-sm font-semibold text-white">
                  {index + 1}
                </span>
                {video.title}
              </h2>
              <VideoCard {...video} />
              <ul className="mb-0 my-2 list-disc space-y-1 pl-5 text-sm">
                {video.points.map(point => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </section>
          ))}

          {!state?.fromSurvey && (
            <Button
              color="secondary"
              className="mx-auto"
              onPress={() => navigate(survey.baseURL)}
            >
              Start survey
            </Button>
          )}
        </div>
      </Main>
    </Page>
  );
};

export default MothVideos;
