import { Page, Main, Header, Section } from '@flumens';

const { P } = Section;

const About = () => (
  <Page id="about">
    <Header title="About" />
    <Main className="ion-padding">
      <Section>
        <P>
          E-Surveyor helps you to assess the quality of the wildflower habitat
          you have created on your farm.
        </P>

        <P>
          Using AI technology the app can automatically identify plant species
          from images you take. Expertise from the UKCEH built into the app can
          assess the quality of the habitat you have created, quantifying the
          number and variety of species supported by the flowers you have grown.
        </P>

        <P>
          The app also compares the species present in your habitat to those in
          your seed mix, making it quick and easy to see which flowers
          established and which didn't.
        </P>
      </Section>
    </Main>
  </Page>
);

export default About;
