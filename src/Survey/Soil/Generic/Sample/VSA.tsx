import { observer } from 'mobx-react';
import { Page, Header, Main, Block, useSample } from '@flumens';
import SinglePhotoPicker from 'common/Components/PhotoPickers/SinglePhotoPicker';
import Sample from 'models/sample';
import {
  aggregateSizeAttr,
  rootsAttr,
  soilStrengthAttr,
  soilSurfaceAttr,
  soilTypeAttr,
} from '../config';

const VSA = () => {
  const { subSample } = useSample<Sample>();
  if (!subSample) throw new Error('Sub-sample is missing');

  const recordAttrs = {
    record: subSample.data,
  };

  return (
    <Page id="survey-soil-vsa" className="theme-soil">
      <Header title="VSA" />
      <Main>
        <div className="list">
          <div className="rounded-list">
            <Block block={soilTypeAttr} {...recordAttrs} />
            <SinglePhotoPicker label="Photo" model={subSample} caption="VSA" />
            <Block block={soilSurfaceAttr} {...recordAttrs} />
            <Block block={aggregateSizeAttr} {...recordAttrs} />
            <Block block={soilStrengthAttr} {...recordAttrs} />
            <Block block={rootsAttr} {...recordAttrs} />
          </div>
        </div>
      </Main>
    </Page>
  );
};

export default observer(VSA);
