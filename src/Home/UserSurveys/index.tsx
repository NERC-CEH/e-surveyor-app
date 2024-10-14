import { useState } from 'react';
import { observer } from 'mobx-react';
import { Page, Main, device, useToast, Button, Badge } from '@flumens';
import {
  IonList,
  IonToolbar,
  IonHeader,
  IonLabel,
  IonSegmentButton,
  IonSegment,
} from '@ionic/react';
import InfoBackgroundMessage from 'common/Components/InfoBackgroundMessage';
import Sample from 'models/sample';
import samples, { getPending, uploadAll } from 'models/samples';
import Survey from './components/Survey';
import './styles.scss';

function byCreateTime(smp1: Sample, smp2: Sample) {
  const date1 = new Date(smp1.createdAt);
  const date2 = new Date(smp2.createdAt);
  return date2.getTime() - date1.getTime();
}

function hasManyPending(pendingSurveys: Sample[]) {
  return pendingSurveys.length > 2;
}

function getPendingSurveys(surveys: any[], uploadIsPrimary: boolean) {
  const byFinishedSurvey = (sample: Sample) => sample.metadata.saved;
  const finishedSurvey = surveys.find(byFinishedSurvey);

  if (!surveys.length) {
    return (
      <IonList lines="full">
        <InfoBackgroundMessage>
          No finished pending surveys.
        </InfoBackgroundMessage>
      </IonList>
    );
  }

  const getSurveyEntry = (sample: Sample) => {
    const onDelete = () => sample.destroy();

    return (
      <Survey
        key={sample.cid}
        sample={sample}
        uploadIsPrimary={uploadIsPrimary}
        onDelete={onDelete}
      />
    );
  };

  const surveysList = surveys.map(getSurveyEntry);

  if (finishedSurvey) {
    return (
      <IonList lines="full">
        {surveysList}

        <InfoBackgroundMessage name="showSurveyUploadTip">
          Please do not forget to upload any pending surveys!
        </InfoBackgroundMessage>
      </IonList>
    );
  }

  return (
    <IonList lines="full">
      {surveysList}

      <InfoBackgroundMessage name="showSurveysDeleteTip">
        To delete any surveys swipe it to the left.
      </InfoBackgroundMessage>
    </IonList>
  );
}

function getAllSurveys(surveys: any[]) {
  if (!surveys.length) {
    return (
      <IonList lines="full">
        <InfoBackgroundMessage>No surveys</InfoBackgroundMessage>
      </IonList>
    );
  }

  const getAllSurveyEntry = (sample: Sample) => {
    const onDelete = () => sample.destroy();
    return <Survey key={sample.cid} sample={sample} onDelete={onDelete} />;
  };
  const surveysList = surveys.map(getAllSurveyEntry);

  return <IonList lines="full">{surveysList}</IonList>;
}

const UserSurveys = () => {
  const [segment, setSegment] = useState('pending');
  const toast = useToast();

  const onSegmentClick = (e: any) => setSegment(e.detail.value);

  const getSamplesList = (pending?: boolean) => {
    const allSamples = (sample: Sample) =>
      pending ? sample.requiresRemoteSync() : true;
    return samples.filter(allSamples).sort(byCreateTime);
  };

  const onUploadAll = () => {
    if (!device.isOnline) {
      toast.warn('Looks like you are offline!');
      return;
    }

    uploadAll();
  };

  const showingPending = segment === 'pending';
  const showingAll = segment === 'all';

  const pendingSurveys = getSamplesList(true);
  const allSurveys = getSamplesList();

  const getPendingSurveysCount = () => {
    const pendingSurveysCount = getPending().length;
    if (!pendingSurveysCount) return null;

    return (
      <Badge
        color="warning"
        skipTranslation
        size="small"
        fill="solid"
        className="mx-1"
      >
        {pendingSurveysCount}
      </Badge>
    );
  };

  const showUploadAll = hasManyPending(pendingSurveys);

  return (
    <Page id="surveys-list">
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonSegment onIonChange={onSegmentClick} value={segment}>
            <IonSegmentButton value="pending">
              <IonLabel className="ion-text-wrap">
                Pending
                {getPendingSurveysCount()}
              </IonLabel>
            </IonSegmentButton>

            <IonSegmentButton value="all">
              <IonLabel className="ion-text-wrap">All</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      <Main className="ion-padding [--padding-top:calc(var(--ion-safe-area-top,0)_+_80px)]">
        {showingPending && showUploadAll && (
          <Button
            className="upload-all-button"
            color="secondary"
            onPress={onUploadAll}
          >
            Upload All
          </Button>
        )}

        {showingPending && getPendingSurveys(pendingSurveys, !showUploadAll)}
        {showingAll && getAllSurveys(allSurveys)}
      </Main>
    </Page>
  );
};

export default observer(UserSurveys);
