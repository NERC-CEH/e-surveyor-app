import { FC } from 'react';
import { Header, Page, Main, Section } from '@flumens';
import flumensLogo from 'common/images/flumens.svg';
import plantNetLogo from './Pl@ntNet_logo.png';
import './styles.scss';

const { P, H } = Section;

const Credits: FC = () => (
  <Page id="credits">
    <Header title="Credits" />
    <Main className="ion-padding">
      <Section>
        <P>
          We are very grateful for all the people that helped to create this
          app:
        </P>
        <P skipTranslation>
          <b>Tom August</b> (UK Centre for Ecology & Hydrology)
        </P>
        <P skipTranslation>
          <b>Richard Pywell</b> (UK Centre for Ecology & Hydrology)
        </P>
        <P skipTranslation>
          <b>Karolis Kazlauskis</b> (Flumens)
        </P>
        <P skipTranslation>
          <b>Vilius Stankaitis</b> (Flumens)
        </P>
        <P skipTranslation>
          <b>Alba Gomez Segura </b> (UK Centre for Ecology & Hydrology)
        </P>
        <P skipTranslation>
          <b>Kelly Jowett</b> (Rothamsted Research)
        </P>
        <P skipTranslation>
          <b>Ben Woodcock </b> (UK Centre for Ecology & Hydrology)
        </P>
        <P skipTranslation>
          <b>Biren Rathod</b> (UK Centre for Ecology & Hydrology)
        </P>
      </Section>

      <Section>
        <p className="logo">
          <img src={plantNetLogo} />
        </p>
        <P>
          The image-based plant species identification service used, is based on
          the Pl@ntNet recognition api, regularly updated and accessible through
          the <a href="https://my.plantnet.org">Pl@ntNet website</a>.
        </P>
      </Section>
      <Section>
        <p className="logo">
          <a href="https://flumens.io">
            <img src={flumensLogo} alt="" />
          </a>
        </p>
        <P>
          This app was hand crafted with love by{' '}
          <a href="https://flumens.io" style={{ whiteSpace: 'nowrap' }}>
            Flumens.
          </a>{' '}
          A technical consultancy that excels at building bespoke environmental
          science and community focussed solutions. For suggestions and feedback
          please do not hesitate to{' '}
          <a href="mailto:enquiries%40flumens.io?subject=App%20Feedback">
            contact us
          </a>
          .
        </P>
      </Section>

      <Section>
        <H>Funding</H>
        <P>
          We are grateful to the UKRI ASSIST project, Defra and the Joint Nature
          Conservation Committee for funding this application.
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
          Thanks to{' '}
          <a href="https://unsplash.com/@mkvandergriff">Maranda Vandergriff</a>,{' '}
          <a href="https://unsplash.com/@rgaleriacom">Ricardo Gomez Angel</a>,{' '}
          <a href="https://unsplash.com/@secretasianman">Viateur Hwang</a>,{' '}
          <a href="https://unsplash.com/@marcusneto">Marcus Neto</a>,{' '}
          <a href="https://unsplash.com/@freestef">Free Steph</a>,{' '}
          <a href="https://unsplash.com/@mickaeltournier">Mickael Tournier</a>{' '}
          from <a href="https://unsplash.com">Unsplash</a>
        </P>
      </Section>
    </Main>
  </Page>
);

export default Credits;
