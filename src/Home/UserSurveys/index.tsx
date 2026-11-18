import { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { useLocation } from 'react-router';
import { Page, Main, device, useToast, Button, Badge } from '@flumens';
import {
  IonList,
  IonToolbar,
  IonHeader,
  IonLabel,
  IonSegmentButton,
  IonSegment,
  type SegmentCustomEvent,
} from '@ionic/react';
import InfoBackgroundMessage from 'common/Components/InfoBackgroundMessage';
import samples, { getPending, uploadAll } from 'models/collections/samples';
import Sample from 'models/sample';
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

function getPendingSurveys(surveys: Sample[], uploadIsPrimary: boolean) {
  const byFinishedSurvey = (sample: Sample) => sample.metadata.saved;
  const finishedSurvey = surveys.find(byFinishedSurvey);

  if (!surveys.length) {
    return (
      <div className="list">
        <InfoBackgroundMessage>
          No finished pending surveys.
        </InfoBackgroundMessage>
      </div>
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

function getAllSurveys(surveys: Sample[]) {
  if (!surveys.length) {
    return (
      <div className="list">
        <InfoBackgroundMessage>No surveys</InfoBackgroundMessage>
      </div>
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
  const { search } = useLocation();
  const toast = useToast();

  useEffect(() => {
    const requestedSegment = new URLSearchParams(search).get('segment');

    if (requestedSegment === 'pending') {
      setSegment(requestedSegment);
    }
  }, [search]);

  const onSegmentClick = (event: SegmentCustomEvent) =>
    setSegment(String(event.detail.value));

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
          <IonSegment
            className="mx-auto [&>ion-segment-button.ios]:my-0.5"
            onIonChange={onSegmentClick}
            value={segment}
          >
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

      <Main className="ion-padding pt-ion-s-20">
        {showingPending && showUploadAll && (
          <Button
            className="upload-all-button bg-primary-600"
            color="primary"
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
