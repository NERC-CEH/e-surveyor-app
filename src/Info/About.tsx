import { Page, Main, Header, Section } from '@flumens';
import VideoCard from 'common/Components/VideoCard';
import { INTRO_VIDEO } from 'common/videos';

const { P } = Section;

const About = () => (
  <Page id="about">
    <Header title="About" />
    <Main>
      <div className="mx-4 mt-4">
        <VideoCard {...INTRO_VIDEO} />
      </div>

      <Section>
        <P>
          e-Surveyor helps farmers and land managers find out what wildlife
          their land supports, and see how it changes over time.
        </P>
        <P>
          Using AI, the app identifies plants, moths and ground beetles from the
          photos you take, and suggests your habitat type from photos of your
          site. Expertise from UKCEH, built into the app, turns your records
          into simple reports.
        </P>
        <P>The app covers three areas:</P>

        <div className="mx-4 space-y-3">
          <section
            aria-labelledby="about-habitat"
            className="theme-habitat border-l-4 border-secondary-500 py-0.5 pl-2.5"
          >
            <div className="m-0 text-[15px] font-bold leading-normal">
              Habitat
            </div>
            <p className="m-0 text-sm leading-normal">
              The habitats on your land, the plants growing there, how good they
              are for pollinators and natural pest control, and how well your
              seed mix has established.
            </p>
          </section>

          <section
            aria-labelledby="about-ecosystem"
            className="theme-ecosystem border-l-4 border-secondary-600 py-0.5 pl-2.5"
          >
            <div className="m-0 text-[15px] font-bold leading-normal">
              Ecosystem Function
            </div>
            <p className="m-0 text-sm leading-normal">
              The moths and ground beetles your land supports. Day-time
              pollinators are coming soon.
            </p>
          </section>

          <section
            aria-labelledby="about-soil"
            className="theme-soil border-l-4 border-secondary-700 py-0.5 pl-2.5"
          >
            <div className="m-0 text-[15px] font-bold leading-normal">Soil</div>
            <p className="m-0 text-sm leading-normal">Coming soon.</p>
          </section>
        </div>

        <P>
          Add your sites, survey them each year, and watch your results build up
          in Surveys &amp; Results. Experts check your records, and they add to
          national wildlife recording.
        </P>
      </Section>
    </Main>
  </Page>
);

export default About;
