import { locationOutline } from 'ionicons/icons';
import { useRouteMatch } from 'react-router-dom';
import { Page, Header, Main, Block, MenuAttrItem, useSample } from '@flumens';
import { IonItem, IonIcon, IonLabel } from '@ionic/react';
import SinglePhotoPicker from 'common/Components/PhotoPickers/SinglePhotoPicker';
import Sample from 'common/models/sample';
import GridRefValue from 'Survey/common/Components/GridRefValue';
import field from '../common/field.svg';
import { sampleNameAttr, somAttr, wormCountAttr } from '../config';
import worm from './worm.svg';

const SampleHome = () => {
  const { subSample: sample } = useSample<Sample>();
  if (!sample) throw new Error('Sub-sample is missing');

  const { url } = useRouteMatch();
  const worms = sample.data[wormCountAttr.id];

  return (
    <Page id="survey-soil-sample-home" className="theme-soil">
      <Header title="Sample" />
      <Main>
        <div className="flex flex-column gap-3">
          <div className="rounded-list">
            <div className="list-divider">Details</div>
            <MenuAttrItem
              routerLink={`${url}/location`}
              icon={locationOutline}
              label="Location"
              skipValueTranslation
              value={<GridRefValue sample={sample} />}
            />
            <Block block={sampleNameAttr} record={sample.data} />
            <SinglePhotoPicker label="Photo" model={sample} caption="Sample" />
          </div>

          <div className="rounded-list">
            <div className="list-divider">Surveys</div>
            <IonItem routerLink={`${url}/vsa`}>
              <IonIcon src={field} slot="start" />
              <IonLabel>Visual Soil Assessment</IonLabel>
            </IonItem>
            <IonItem routerLink={`${url}/worms`}>
              <IonIcon src={worm} slot="start" />
              <IonLabel>Earthworm Survey</IonLabel>
              <IonLabel slot="end">{worms || ''}</IonLabel>
            </IonItem>
            <Block block={somAttr} record={sample.data} />
          </div>
        </div>
      </Main>
    </Page>
  );
};

export default SampleHome;
