import { locationOutline } from 'ionicons/icons';
import { useRouteMatch } from 'react-router-dom';
import { Page, Header, Main, Block, MenuAttrItem } from '@flumens';
import { IonList, IonItem, IonIcon, IonLabel } from '@ionic/react';
import SinglePhotoPicker from 'common/Components/PhotoPickers/SinglePhotoPicker';
import Sample from 'common/models/sample';
import GridRefValue from 'Survey/common/Components/GridRefValue';
import { sampleNameAttr, somAttr } from '../config';
import field from '../field.svg';
import worm from './worm.svg';

type Props = { subSample: Sample };

const SampleHome = ({ subSample: sample }: Props) => {
  const { url } = useRouteMatch();
  const isDisabled = sample.isDisabled();

  return (
    <Page id="survey-soil-sample-home">
      <Header title="Sample" />
      <Main>
        <IonList lines="full">
          <div className="list-title">Details</div>
          <div className="rounded-list">
            <MenuAttrItem
              routerLink={`${url}/location`}
              icon={locationOutline}
              label="Location"
              skipValueTranslation
              value={<GridRefValue sample={sample} />}
              disabled={isDisabled}
            />
            <Block
              block={sampleNameAttr}
              isDisabled={isDisabled}
              record={sample.attrs}
            />
            <SinglePhotoPicker label="Photo" model={sample} caption="Sample" />
          </div>

          <div className="list-title">Surveys</div>
          <div className="rounded-list">
            <IonItem routerLink={`${url}/vsa`}>
              <IonIcon src={field} slot="start" />
              <IonLabel>Visual Soil Assessment</IonLabel>
            </IonItem>
            <IonItem routerLink={`${url}/worms`}>
              <IonIcon src={worm} slot="start" />
              <IonLabel>Earthworm Survey</IonLabel>
            </IonItem>
            <Block
              block={somAttr}
              isDisabled={isDisabled}
              record={sample.attrs}
            />
          </div>
        </IonList>
      </Main>
    </Page>
  );
};

export default SampleHome;
