import { observer } from 'mobx-react';
import { Page, Header, Main, Block, useSample } from '@flumens';
import { IonList } from '@ionic/react';
import SinglePhotoPicker from 'common/Components/PhotoPickers/SinglePhotoPicker';
import Sample from 'models/sample';
import { wormCountAttr } from '../config';

const WormHome = () => {
  const { subSample } = useSample<Sample>();
  if (!subSample) throw new Error('Sub-sample is missing');

  const recordAttrs = {
    record: subSample.data,
  };

  return (
    <Page id="survey-soil-worm" className="theme-soil">
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
