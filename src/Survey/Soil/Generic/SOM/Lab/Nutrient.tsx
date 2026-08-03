import { observer } from 'mobx-react';
import { Page, Main, Block, Header, useSample } from '@flumens';
import Sample from 'common/models/sample';
import { labKAttr, labMgAttr, labPAttr, labPHAttr } from '../../config';

const Lab = () => {
  const { sample } = useSample<Sample>();
  if (!sample) throw new Error('Sample is missing');

  const recordAttrs = { record: sample.data };

  return (
    <Page id="survey-soil-som-lab-nutrient" className="theme-soil">
      <Header title="pH and nutrients" />
      <Main>
        <div className="list">
          <div className="rounded-list">
            <Block block={labPHAttr} {...recordAttrs} />
            <Block block={labPAttr} {...recordAttrs} />
            <Block block={labKAttr} {...recordAttrs} />
            <Block block={labMgAttr} {...recordAttrs} />
          </div>
        </div>
      </Main>
    </Page>
  );
};

export default observer(Lab);
