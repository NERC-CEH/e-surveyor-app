/* eslint-disable no-param-reassign */
import { observer } from 'mobx-react';
import { Page, Header, Main, Block } from '@flumens';
import { IonList } from '@ionic/react';
import SinglePhotoPicker from 'common/Components/PhotoPickers/SinglePhotoPicker';
import Sample from 'models/sample';
import { wormCountAttr } from '../config';

interface Props {
  subSample: Sample;
}

const WormHome = ({ subSample }: Props) => {
  const recordAttrs = {
    record: subSample.attrs,
  };

  return (
    <Page id="survey-soil-worm">
      <Header title="Earthworm" />
      <Main>
        <IonList lines="full">
          <div className="rounded-list">
            <SinglePhotoPicker
              label="Photo"
              model={subSample}
              caption="Worms"
            />
            <Block block={wormCountAttr} {...recordAttrs} />
          </div>
        </IonList>
      </Main>
    </Page>
  );
};

export default observer(WormHome);
