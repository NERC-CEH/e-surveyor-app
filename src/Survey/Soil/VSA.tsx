/* eslint-disable no-param-reassign */
import { observer } from 'mobx-react';
import { locationOutline } from 'ionicons/icons';
import { useRouteMatch } from 'react-router';
import { Page, Header, Main, Block, MenuAttrItem } from '@flumens';
import { IonList } from '@ionic/react';
import SinglePhotoPicker from 'common/Components/PhotoPickers/SinglePhotoPicker';
import Sample from 'models/sample';
import GridRefValue from 'Survey/common/Components/GridRefValue';
import {
  aggregateSizeAttr,
  rootsAttr,
  soilStrengthAttr,
  soilSurfaceAttr,
  soilTypeAttr,
} from './config';

interface Props {
  subSample: Sample;
}

const VSA = ({ subSample }: Props) => {
  const { url } = useRouteMatch();

  const recordAttrs = {
    record: subSample.attrs,
    isDisabled: subSample.isDisabled(),
  };

  return (
    <Page id="survey-soil-vsa">
      <Header title="VSA" />
      <Main>
        <IonList lines="full">
          <div className="rounded-list">
            <Block block={soilTypeAttr} {...recordAttrs} />
            <MenuAttrItem
              routerLink={`${url}/location`}
              icon={locationOutline}
              label="Location"
              skipValueTranslation
              value={<GridRefValue sample={subSample} />}
              disabled={subSample.isDisabled()}
            />
            <SinglePhotoPicker label="Photo" model={subSample} />
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
