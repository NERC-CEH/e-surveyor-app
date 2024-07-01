/* eslint-disable no-param-reassign */
import { useContext } from 'react';
import { observer } from 'mobx-react';
import { locationOutline } from 'ionicons/icons';
import { useRouteMatch } from 'react-router';
import { Page, Header, Main, MenuAttrItem, Block } from '@flumens';
import { IonIcon, IonItem, IonLabel, IonList, NavContext } from '@ionic/react';
import Sample, { useValidateCheck } from 'models/sample';
import GridRefValue from 'Survey/common/Components/GridRefValue';
import HeaderButton from 'Survey/common/Components/HeaderButton';
import MenuDateAttr from 'Survey/common/Components/MenuDateAttr';
import UploadedRecordInfoMessage from 'Survey/common/Components/UploadedRecordInfoMessage';
import { farmNameAttr, fieldNameAttr } from './config';
import field from './field.svg';
import soil from './soil.svg';
import tractor from './tractor.svg';
import worm from './worm.svg';

interface Props {
  sample: Sample;
}

const Home = ({ sample }: Props) => {
  const { url } = useRouteMatch();
  const { navigate } = useContext(NavContext);
  const checkSampleStatus = useValidateCheck(sample);

  const isDisabled = sample.isDisabled();

  const onFinish = async () => {
    const isValid = checkSampleStatus();
    if (!isValid) return;

    const saveAndReturn = () => {
      sample.cleanUp();
      sample.save();
      navigate(`${url}/report`);
    };

    // eslint-disable-next-line no-param-reassign
    sample.metadata.saved = true;
    saveAndReturn();
  };

  const isInvalid = sample.validateRemote();

  const finishButton = sample.remote.synchronising ? null : (
    <HeaderButton onClick={onFinish} isInvalid={isInvalid}>
      {sample.metadata.saved ? 'Report' : 'Finish'}
    </HeaderButton>
  );

  const isTraining = !!sample.attrs.training;
  const trainingModeSubheader = isTraining && (
    <div className="bg-black p-1 text-center text-sm text-white">
      Training Mode
    </div>
  );

  const recordAttrs = {
    record: sample.attrs,
    isDisabled: sample.isDisabled(),
  };

  return (
    <Page id="survey-moth-home">
      <Header
        title="Survey"
        rightSlot={finishButton}
        subheader={trainingModeSubheader}
      />
      <Main>
        {isDisabled && <UploadedRecordInfoMessage />}

        <IonList lines="full">
          <div className="list-title">Details</div>
          <div className="rounded-list">
            <MenuDateAttr model={sample} />
            <MenuAttrItem
              routerLink={`${url}/location`}
              icon={locationOutline}
              label="Location"
              skipValueTranslation
              value={<GridRefValue sample={sample} />}
              disabled={isDisabled}
            />
            <Block block={farmNameAttr} {...recordAttrs} />
            <Block block={fieldNameAttr} {...recordAttrs} />
            <IonItem routerLink={`${url}/management`}>
              <IonIcon src={tractor} slot="start" />
              <IonLabel>Management</IonLabel>
            </IonItem>
          </div>

          <div className="list-title">Surveys</div>
          <div className="rounded-list">
            <IonItem routerLink={`${url}/vsa/${sample.samples[0].cid}`}>
              <IonIcon src={field} slot="start" />
              <IonLabel>Visual Soil Assessment</IonLabel>
            </IonItem>
            <IonItem routerLink={`${url}/worms`}>
              <IonIcon src={worm} slot="start" />
              <IonLabel>Earthworm Survey</IonLabel>
            </IonItem>
            <IonItem routerLink={`${url}/som`}>
              <IonIcon src={soil} slot="start" />
              <IonLabel>Soil Organic Matter (SOM) Survey</IonLabel>
            </IonItem>
          </div>
        </IonList>
      </Main>
    </Page>
  );
};

export default observer(Home);
