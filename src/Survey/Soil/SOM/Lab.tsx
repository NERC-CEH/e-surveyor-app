import { observer } from 'mobx-react';
import { Page, Main, Block, Header } from '@flumens';
import { IonList } from '@ionic/react';
import Sample from 'common/models/sample';
import {
  labCalciumCarbonateAttr,
  labCationAttr,
  labClayAttr,
  labKAttr,
  labLOIAttr,
  labMgAttr,
  labNRMAttr,
  labNameAttr,
  labNitrogenAttr,
  labPAttr,
  labPHAttr,
  labSOMAttr,
  labSandAttr,
  labSiltAttr,
  labTOCAttr,
  labTypeAttr,
} from '../config';

type Props = { sample: Sample };

const Lab = ({ sample }: Props) => {
  const recordAttrs = { record: sample.attrs, isDisabled: sample.isDisabled() };

  const showLabType =
    !!sample.attrs[labSandAttr.id] ||
    !!sample.attrs[labSiltAttr.id] ||
    !!sample.attrs[labClayAttr.id];

  return (
    <Page id="survey-soil-som-lab">
      <Header title="Lab results" />
      <Main>
        <IonList lines="full">
          <div className="rounded-list">
            <Block block={labNameAttr} {...recordAttrs} />
            <Block block={labTOCAttr} {...recordAttrs} />
            <Block block={labSOMAttr} {...recordAttrs} />
            <Block block={labLOIAttr} {...recordAttrs} />
          </div>

          <div className="list-title">Texture analyses</div>
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

          <div className="list-title">pH and nutrient analysis</div>
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
