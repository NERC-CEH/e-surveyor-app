import { observer } from 'mobx-react';
import { Page, Main, Block, Header } from '@flumens';
import { IonList } from '@ionic/react';
import Sample from 'common/models/sample';
import { labKAttr, labMgAttr, labPAttr, labPHAttr } from '../../config';

type Props = { sample: Sample };

const Lab = ({ sample }: Props) => {
  const recordAttrs = { record: sample.data };

  return (
    <Page id="survey-soil-som-lab-nutrient">
      <Header title="pH and nutrients" />
      <Main>
        <IonList lines="full">
          <div className="rounded-list">
            <Block block={labPHAttr} {...recordAttrs} />
            <Block block={labPAttr} {...recordAttrs} />
            <Block block={labKAttr} {...recordAttrs} />
            <Block block={labMgAttr} {...recordAttrs} />
          </div>
        </IonList>
      </Main>
    </Page>
  );
};

export default observer(Lab);
