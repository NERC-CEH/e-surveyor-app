import { observer } from 'mobx-react';
import { flaskOutline } from 'ionicons/icons';
import { useRouteMatch } from 'react-router';
import { Page, Header, Main, Block, useSample } from '@flumens';
import { IonIcon, IonItem, IonLabel } from '@ionic/react';
import Sample from 'models/sample';
import { SOMDepthAttr, SOMDiameterAttr, SOMPatternAttr } from '../config';

const SOMHome = () => {
  const { sample } = useSample<Sample>();
  if (!sample) throw new Error('Sample is missing');

  const { url } = useRouteMatch();
  const recordAttrs = { record: sample.data };

  return (
    <Page id="survey-soil-som" className="theme-soil">
      <Header title="SOM" />
      <Main>
        <div className="list">
          <div className="rounded-list">
            <Block block={SOMPatternAttr} {...recordAttrs} />
            <Block block={SOMDepthAttr} {...recordAttrs} />
            <Block block={SOMDiameterAttr} {...recordAttrs} />

            <IonItem routerLink={`${url}/lab`}>
              <IonIcon src={flaskOutline} slot="start" />
              <IonLabel>Lab results</IonLabel>
            </IonItem>
          </div>
        </div>
      </Main>
    </Page>
  );
};

export default observer(SOMHome);
