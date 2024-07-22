/* eslint-disable no-param-reassign */
import { observer } from 'mobx-react';
import { locationOutline } from 'ionicons/icons';
import { useRouteMatch } from 'react-router';
import { Page, Header, Main, Block, MenuAttrItem } from '@flumens';
import { IonList } from '@ionic/react';
import SinglePhotoPicker from 'common/Components/PhotoPickers/SinglePhotoPicker';
import Sample from 'models/sample';
import GridRefValue from 'Survey/common/Components/GridRefValue';
import { wormCountAttr } from '../config';

interface Props {
  subSample: Sample;
}

const WormHome = ({ subSample }: Props) => {
  const { url } = useRouteMatch();

  const recordAttrs = {
    record: subSample.attrs,
    isDisabled: subSample.isDisabled(),
  };

  return (
    <Page id="survey-soil-worm">
      <Header title="Earthworm" />
      <Main>
        <IonList lines="full">
          <div className="rounded-list">
            <MenuAttrItem
              routerLink={`${url}/location`}
              icon={locationOutline}
              label="Location"
              skipValueTranslation
              value={<GridRefValue sample={subSample} />}
              disabled={subSample.isDisabled()}
            />
            <SinglePhotoPicker label="Photo" model={subSample} />
            <Block block={wormCountAttr} {...recordAttrs} />
          </div>
        </IonList>
      </Main>
    </Page>
  );
};

export default observer(WormHome);
