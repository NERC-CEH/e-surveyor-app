import { observer } from 'mobx-react';
import { flaskOutline } from 'ionicons/icons';
import { useRouteMatch } from 'react-router-dom';
import { Page, Main, Block, Header, useSample } from '@flumens';
import { IonIcon, IonItem, IonLabel, IonList } from '@ionic/react';
import Sample from 'common/models/sample';
import { labLOIAttr, labNameAttr, labSOMAttr, labTOCAttr } from '../../config';

const Lab = () => {
  const { sample } = useSample<Sample>();
  if (!sample) throw new Error('Sample is missing');

  const { url } = useRouteMatch();
  const recordAttrs = { record: sample.data };

  return (
    <Page id="survey-soil-som-lab" className="theme-soil">
      <Header title="Lab results" />
      <Main>
        <IonList lines="full" className="flex flex-col gap-2">
          <div className="rounded-list">
            <Block block={labNameAttr} {...recordAttrs} />
            <Block block={labTOCAttr} {...recordAttrs} />
            <Block block={labSOMAttr} {...recordAttrs} />
            <Block block={labLOIAttr} {...recordAttrs} />
          </div>

          <div className="rounded-list">
            <IonItem routerLink={`${url}/texture`}>
              <IonIcon src={flaskOutline} slot="start" />
              <IonLabel>Texture analyses</IonLabel>
            </IonItem>
            <IonItem routerLink={`${url}/nutrient`}>
              <IonIcon src={flaskOutline} slot="start" />
              <IonLabel>pH and nutrient analysis</IonLabel>
            </IonItem>
          </div>
        </IonList>
      </Main>
    </Page>
  );
};

export default observer(Lab);
