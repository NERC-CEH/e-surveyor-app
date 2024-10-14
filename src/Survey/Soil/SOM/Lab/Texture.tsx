import { observer } from 'mobx-react';
import { Page, Main, Block, Header } from '@flumens';
import { IonList } from '@ionic/react';
import Sample from 'common/models/sample';
import {
  labCalciumCarbonateAttr,
  labCationAttr,
  labClayAttr,
  labNRMAttr,
  labNitrogenAttr,
  labSandAttr,
  labSiltAttr,
  labTypeAttr,
} from '../../config';

type Props = { sample: Sample };

const Lab = ({ sample }: Props) => {
  const recordAttrs = { record: sample.attrs };

  const showLabType =
    !!sample.attrs[labSandAttr.id] ||
    !!sample.attrs[labSiltAttr.id] ||
    !!sample.attrs[labClayAttr.id];

  return (
    <Page id="survey-soil-som-lab-texture">
      <Header title="Texture analyses" />
      <Main>
        <IonList lines="full">
          <div className="rounded-list">
            <Block block={labCalciumCarbonateAttr} {...recordAttrs} />
            <Block block={labNitrogenAttr} {...recordAttrs} />
            <Block block={labCationAttr} {...recordAttrs} />
            <Block block={labSandAttr} {...recordAttrs} />
            <Block block={labSiltAttr} {...recordAttrs} />
            <Block block={labClayAttr} {...recordAttrs} />
            {showLabType && <Block block={labTypeAttr} {...recordAttrs} />}
            <Block block={labNRMAttr} {...recordAttrs} />
          </div>
        </IonList>
      </Main>
    </Page>
  );
};

export default observer(Lab);
