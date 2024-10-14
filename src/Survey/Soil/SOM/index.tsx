/* eslint-disable no-param-reassign */
import { observer } from 'mobx-react';
import { flaskOutline } from 'ionicons/icons';
import { useRouteMatch } from 'react-router';
import { Page, Header, Main, Block } from '@flumens';
import { IonIcon, IonItem, IonLabel, IonList } from '@ionic/react';
import Sample from 'models/sample';
import { SOMDepthAttr, SOMDiameterAttr, SOMPatternAttr } from '../config';

interface Props {
  sample: Sample;
}

const SOMHome = ({ sample }: Props) => {
  const { url } = useRouteMatch();
  const recordAttrs = { record: sample.attrs };

  return (
    <Page id="survey-soil-som">
      <Header title="SOM" />
      <Main>
        <IonList lines="full">
          <div className="rounded-list">
            <Block block={SOMPatternAttr} {...recordAttrs} />
            <Block block={SOMDepthAttr} {...recordAttrs} />
            <Block block={SOMDiameterAttr} {...recordAttrs} />

            <IonItem routerLink={`${url}/lab`}>
              <IonIcon src={flaskOutline} slot="start" />
              <IonLabel>Lab results</IonLabel>
            </IonItem>
          </div>
        </IonList>
      </Main>
    </Page>
  );
};

export default observer(SOMHome);
