import React from 'react';
import { IonItem, IonLabel } from '@ionic/react';
import { Header, Page, Main, Section } from '@apps';
import { Trans as T } from 'react-i18next';
// import habitats from 'common/data/habitats';
import 'common/images/flumens.svg';
import './styles.scss';

const { P, H } = Section;

export default () => (
  <Page id="credits">
    <Header title="Credits" />
    <Main class="ion-padding">
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
          <b>Biren Rathod</b> (UK Centre for Ecology & Hydrology)
        </P>
        <P skipTranslation>
          <b>Karolis Kazlauskis</b> (Flumens)
        </P>
        <P skipTranslation>
          <b>Vilius Stankaitis</b> (Flumens)
        </P>
      </Section>

      <Section>
        <p className="flumens-logo">
          <a href="https://flumens.io">
            <img src="/images/flumens.svg" alt="" />
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
        </P>
      </Section>
      <Section>
        <H>Photos</H>
        <IonItem lines="none">
          <IonLabel class="ion-text-wrap">
            <i>
              <T>Home page:</T>{' '}
            </i>
            <span>Marten Bjork on Unsplash</span>
          </IonLabel>
        </IonItem>
      </Section>
    </Main>
  </Page>
);
