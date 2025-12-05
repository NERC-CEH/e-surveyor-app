/* eslint-disable no-param-reassign */
import { observer } from 'mobx-react';
import { Page, Header, Main, Block } from '@flumens';
import { IonList } from '@ionic/react';
import SinglePhotoPicker from 'common/Components/PhotoPickers/SinglePhotoPicker';
import Sample from 'models/sample';
import {
  aggregateSizeAttr,
  rootsAttr,
  soilStrengthAttr,
  soilSurfaceAttr,
  soilTypeAttr,
} from '../config';

interface Props {
  subSample: Sample;
}

const VSA = ({ subSample }: Props) => {
  const recordAttrs = {
    record: subSample.data,
  };

  return (
    <Page id="survey-soil-vsa">
      <Header title="VSA" />
      <Main>
        <IonList lines="full">
          <div className="rounded-list">
            <Block block={soilTypeAttr} {...recordAttrs} />
            <SinglePhotoPicker label="Photo" model={subSample} caption="VSA" />
            <Block block={soilSurfaceAttr} {...recordAttrs} />
            <Block block={aggregateSizeAttr} {...recordAttrs} />
            <Block block={soilStrengthAttr} {...recordAttrs} />
            <Block block={rootsAttr} {...recordAttrs} />
          </div>
        </IonList>
      </Main>
    </Page>
  );
};

export default observer(VSA);
