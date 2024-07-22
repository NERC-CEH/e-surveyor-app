/* eslint-disable no-param-reassign */
import { observer } from 'mobx-react';
import { locationOutline } from 'ionicons/icons';
import { useRouteMatch } from 'react-router';
import { Page, Header, Main, MenuAttrItem, Block } from '@flumens';
import { IonList } from '@ionic/react';
import Sample from 'models/sample';
import GridRefValue from 'Survey/common/Components/GridRefValue';
import { SOMIDAttr } from '../config';

interface Props {
  subSample: Sample;
}

const SOMHome = ({ subSample }: Props) => {
  const { url } = useRouteMatch();

  return (
    <Page id="survey-soil-som">
      <Header title="SOM" />
      <Main>
        <IonList lines="full">
          <div className="rounded-list">
            <Block
              block={SOMIDAttr}
              record={subSample.attrs}
              isDisabled={subSample.isDisabled()}
            />

            <MenuAttrItem
              routerLink={`${url}/location`}
              icon={locationOutline}
              label="Location"
              skipValueTranslation
              value={<GridRefValue sample={subSample} />}
              disabled={subSample.isDisabled()}
            />
          </div>
        </IonList>
      </Main>
    </Page>
  );
};

export default observer(SOMHome);
