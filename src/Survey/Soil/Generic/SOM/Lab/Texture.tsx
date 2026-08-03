import { observer } from 'mobx-react';
import { Page, Main, Block, Header, useSample } from '@flumens';
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

const Lab = () => {
  const { sample } = useSample<Sample>();
  if (!sample) throw new Error('Sample is missing');

  const recordAttrs = { record: sample.data };

  const showLabType =
    !!sample.data[labSandAttr.id] ||
    !!sample.data[labSiltAttr.id] ||
    !!sample.data[labClayAttr.id];

  return (
    <Page id="survey-soil-som-lab-texture" className="theme-soil">
      <Header title="Texture analyses" />
      <Main>
        <div className="list">
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
        </div>
      </Main>
    </Page>
  );
};

export default observer(Lab);
