import { observer } from 'mobx-react';
import { flaskOutline } from 'ionicons/icons';
import { useRouteMatch } from 'react-router-dom';
import { Page, Main, Block, Header } from '@flumens';
import { IonIcon, IonItem, IonLabel, IonList } from '@ionic/react';
import Sample from 'common/models/sample';
import { labLOIAttr, labNameAttr, labSOMAttr, labTOCAttr } from '../../config';

type Props = { sample: Sample };

const Lab = ({ sample }: Props) => {
  const { url } = useRouteMatch();
  const recordAttrs = { record: sample.attrs };

  return (
    <Page id="survey-soil-som-lab">
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
