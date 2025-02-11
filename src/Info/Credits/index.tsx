import { Header, Page, Main, Section } from '@flumens';
import flumensLogo from 'common/images/flumens.svg';
import rothamstedLogo from 'common/images/rothamsted-logo.png';
import plantNetLogo from './Pl@ntNet_logo.png';
import UKCEHLogo from './UKCEHLogo.png';

const { P, H } = Section;

const Credits = () => (
  <Page id="credits">
    <Header title="Credits" />
    <Main>
      <Section>
        <H>Developed by UKCEH</H>
        <img src={UKCEHLogo} className="mx-auto my-10 block max-w-[70%]" />
      </Section>

      <Section>
        <H>Funding</H>
        <P>
          We are grateful to the UKRI ASSIST project, Defra and the Joint Nature
          Conservation Committee for funding this application. The moth
          application and the habitat reporting received funding from JNCC
          through the Natural Capital Ecosystem Assessment.
        </P>
      </Section>

      <Section>
        <P>
          We are very grateful for all the people that helped to create this
          app:
        </P>
        <div className="mx-4 flex flex-col gap-2">
          <div className="underline">UK Centre for Ecology & Hydrology:</div>
          <div>Tom August</div>
          <div>Richard Pywell</div>
          <div>Michael Pocock</div>
          <div>Abigail Lowe</div>
          <div>Lucy Ridding</div>
          <div>Grace Skinner</div>
          <div>Zeke Marshall</div>
          <div>Alba Gomez Segura</div>
          <div>Ben Woodcock</div>
          <div>Biren Rathod</div>
        </div>
        <div className="mx-4 mt-4 flex flex-col gap-2">
          <div className="underline">Rothamsted Research</div>
          <div>Kelly Jowett</div>
        </div>

        <div className="mx-4 my-4 flex flex-col gap-2">
          <div className="underline">Flumens</div>
          <div>Karolis Kazlauskis</div>
          <div>Vilius Stankaitis</div>
        </div>
      </Section>

      <Section>
        <img src={rothamstedLogo} className="mx-auto my-10 block max-w-[70%]" />
      </Section>

      <Section>
        <img
          src={plantNetLogo}
          className="mx-auto mb-0 mt-[30px] block w-2/5 max-w-[200px]"
        />
        <P>
          The image-based plant species identification service used, is based on
          the Pl@ntNet recognition api, regularly updated and accessible through
          the <a href="https://my.plantnet.org">Pl@ntNet website</a>.
        </P>
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
          <a href="https://flumens.io" style={{ whiteSpace: 'nowrap' }}>
            Flumens
          </a>
          , a technical consultancy specializing in creating customized
          environmental science and community-focused solutions, created this
          app with love. If you have any feedback or suggestions, please don't
          hesitate to{' '}
          <a href="mailto:enquiries%40flumens.io?subject=App%20Feedback">
            contact us
          </a>
          .
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
