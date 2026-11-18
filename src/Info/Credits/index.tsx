import { Fragment } from 'react';
import { Header, Page, Main, Section } from '@flumens';
import flumensLogo from 'common/images/flumens.svg';
import LogoGrid from './LogoGrid';
import plantNetLogo from './Pl@ntNet_logo.png';
import UKCEHLogo from './UKCEHLogo.svg';
import { FUNDERS, PARTNERS, PEOPLE, VERIFIERS } from './content';
import bounceLogo from './images/bounce-video.svg';
import observationLogo from './images/observation-org.png';
import lincolnLogo from './images/university-of-lincoln.png';

const { P, H } = Section;

const Credits = () => (
  <Page id="credits">
    <Header title="Credits" />
    <Main>
      <Section>
        <H>Developed by UKCEH</H>
        <a href="https://www.ceh.ac.uk">
          <img
            src={UKCEHLogo}
            alt="UK Centre for Ecology & Hydrology"
            className="mx-auto block max-w-[70%]"
          />
        </a>
      </Section>

      <Section>
        <H>Funding</H>
        <P>
          We are grateful to the UKRI ASSIST project, Defra and the Joint Nature
          Conservation Committee for funding this application. The moth
          application and the habitat reporting received funding from JNCC
          through the Natural Capital and Ecosystem Assessment (NCEA). AI-HAB,
          which suggests your habitat type, is funded by the UKRI Natural
          Environment Research Council (NERC). We are also grateful for funding
          from AgZero+ and UK-SCAPE (UKCEH National Capability).
        </P>
        <LogoGrid logos={FUNDERS} />
      </Section>

      <Section>
        <H>Partners</H>
        <P>We are also grateful to our project partners:</P>
        <LogoGrid logos={PARTNERS} />
      </Section>

      <Section>
        <H>People</H>
        <P>
          We are very grateful for all the people that helped to create this
          app:
        </P>
        <div className="mx-4 mb-8">
          {PEOPLE.map(({ organisation, names }) => (
            <Fragment key={organisation}>
              <div className="underline my-2">{organisation}</div>
              <div className="px-2">
                {names.map(name => (
                  <div key={name}>{name}</div>
                ))}
              </div>
            </Fragment>
          ))}
        </div>
      </Section>

      <Section>
        <a href="https://flumens.io" aria-label="Flumens link">
          <img
            src={flumensLogo}
            alt="flumens"
            className="mx-auto mb-0 mt-[30px] block w-2/5 max-w-[200px]"
          />
        </a>
        <P>
          Made with care by{' '}
          <a href="https://flumens.io" className="whitespace-nowrap">
            Flumens
          </a>
          , a technology consultancy creating tailored digital solutions for
          environmental science and communities. We'd love to hear from you! If
          you have feedback, ideas, or suggestions, please{' '}
          <a href="mailto:enquiries%40flumens.io?subject=App%20Feedback">
            get in touch
          </a>
          .
        </P>
      </Section>

      <Section>
        <a href="https://my.plantnet.org">
          <img
            src={plantNetLogo}
            alt="Pl@ntNet"
            className="mx-auto mb-0 mt-[30px] block w-2/5 max-w-[200px]"
          />
        </a>
        <P>
          The image-based plant species identification service used, is based on
          the Pl@ntNet recognition api, regularly updated and accessible through
          the <a href="https://my.plantnet.org">Pl@ntNet website</a>.
        </P>
      </Section>

      <Section>
        <a href="https://observation.org">
          <img
            src={observationLogo}
            alt="Observation.org"
            className="mx-auto my-6 block w-2/5 max-w-[70px]"
          />
        </a>
        <P>
          Moths and ground beetles (carabids) are identified using the image
          recognition models from{' '}
          <a href="https://observation.org">Observation.org</a>.
        </P>
      </Section>

      <Section>
        <a href="https://www.lincoln.ac.uk">
          <img
            src={lincolnLogo}
            alt="University of Lincoln"
            className="mx-auto my-6 block w-2/5 max-w-[200px]"
          />
        </a>
        <P>
          AI-HAB, which suggests your habitat type from photos, was built by
          UKCEH with the{' '}
          <a href="https://www.lincoln.ac.uk">University of Lincoln</a>.
        </P>
      </Section>

      <Section>
        <H>Checking your records</H>
        <P>
          Records are verified on <a href="https://irecord.org.uk">iRecord</a>{' '}
          by the{' '}
          <a href="https://butterfly-conservation.org">
            National Moth Recording Scheme (Butterfly Conservation)
          </a>{' '}
          and the{' '}
          <a href="https://www.brc.ac.uk/scheme/ground-beetle-recording-scheme">
            Ground Beetle Recording Scheme
          </a>{' '}
          (Biological Records Centre). Thank you to all the expert verifiers.
        </P>
        <LogoGrid logos={VERIFIERS} />
      </Section>

      <Section>
        <a
          href="https://www.bouncevideo.co.uk"
          className="mx-4 mt-4 block rounded-lg bg-neutral-800! p-4"
        >
          <img
            src={bounceLogo}
            alt="Bounce Video"
            className="mx-auto block w-2/5 max-w-[200px]"
          />
        </a>
        <P>
          The guidance videos were made by{' '}
          <a href="https://www.bouncevideo.co.uk">Bounce Video</a>.
        </P>
      </Section>

      <Section>
        <H>Graphics</H>
        <P>
          Icons made by{' '}
          <a href="https://www.flaticon.com/authors/freepik" title="Freepik">
            Freepik
          </a>{' '}
          from{' '}
          <a href="https://www.flaticon.com/" title="Flaticon">
            www.flaticon.com
          </a>
          .{' '}
          <a href="https://www.freepik.com/vectors/flower">
            Flower vector created by rawpixel.com - www.freepik.com
          </a>
        </P>
      </Section>

      <Section>
        <H>Photos</H>
        <P>
          Thanks to Martin Harvey,{' '}
          <a href="https://unsplash.com/@mkvandergriff">Maranda Vandergriff</a>,{' '}
          <a href="https://unsplash.com/@rgaleriacom">Ricardo Gomez Angel</a>,{' '}
          <a href="https://unsplash.com/@secretasianman">Viateur Hwang</a>,{' '}
          <a href="https://unsplash.com/@marcusneto">Marcus Neto</a>,{' '}
          <a href="https://unsplash.com/@freestef">Free Steph</a> and{' '}
          <a href="https://unsplash.com/@mickaeltournier">Mickael Tournier</a>.
        </P>

        <P>
          Thanks to Rob Still and Chris Gibson for providing plant photos for
          the habitat report, which feature in the latest{' '}
          <a href="https://press.princeton.edu/books/paperback/9780691245409/british-and-irish-wild-flowers-and-plants">
            WILDGuides for British & Irish Wildflowers and Plants
          </a>
          .
        </P>
      </Section>
    </Main>
  </Page>
);

export default Credits;
