import { useContext } from 'react';
import { observer } from 'mobx-react';
import clsx from 'clsx';
import { leaf, checkmark, alertCircleOutline } from 'ionicons/icons';
import { useRouteMatch } from 'react-router-dom';
import { Main, Button } from '@flumens';
import { IonList, IonItem, IonIcon, NavContext } from '@ionic/react';
import Sample from 'models/sample';
import InfoBackgroundMessage from 'Components/InfoBackgroundMessage';
import UploadedRecordInfoMessage from 'Survey/common/Components/UploadedRecordInfoMessage';
import {
  bareGroundAttr,
  deadWoodAttr,
  litterThatchAttr,
  mossLiverwortAttr,
  standingWaterAttr,
  vegetationCompAttr,
} from '../config';

function byDate(smp1: Sample, smp2: Sample) {
  const date1 = new Date(smp1.data.date);
  const date2 = new Date(smp2.data.date);
  return date2.getTime() - date1.getTime();
}

const hasUnsavedChanges = (quadratSample: Sample) => {
  if (quadratSample.metadata.saved) return false;

  const hasQuadratPhoto = quadratSample.media.length > 0;
  const hasSpecies = quadratSample.occurrences.length > 0;

  const coverAttrIds = [
    vegetationCompAttr.id,
    bareGroundAttr.id,
    litterThatchAttr.id,
    mossLiverwortAttr.id,
    deadWoodAttr.id,
    standingWaterAttr.id,
  ];

  const hasCoverData = coverAttrIds.some(
    attrId => (quadratSample.data[attrId] || 0) > 0
  );

  return hasQuadratPhoto || hasSpecies || hasCoverData;
};

function getCompletionProps(quadratSample: Sample) {
  const isQuadratComplete =
    quadratSample.metadata.saved || quadratSample.isDisabled;
  const isUnsaved = hasUnsavedChanges(quadratSample);

  const savedQuadratClasses =
    'bg-ion-secondary-100/20 shadow-[inset_2px_0_0_0_color-mix(in_srgb,var(--color-secondary-900)_20%,transparent)]';
  const changedQuadratClasses =
    'bg-ion-warning-200/20 shadow-[inset_2px_0_0_0_color-mix(in_srgb,var(--color-warning-600)_40%,transparent)]';

  const props: any = {
    className: clsx(
      'ps-ion-1',
      isQuadratComplete && savedQuadratClasses,
      isUnsaved && changedQuadratClasses
    ),
  };

  if (isQuadratComplete) {
    props.detailIcon = checkmark;
  } else if (isUnsaved) {
    props.detailIcon = alertCircleOutline;
  }

  return props;
}

type Props = {
  sample: Sample;
  isDisabled?: boolean;
};

const MainComponent = ({ sample, isDisabled }: Props) => {
  const match = useRouteMatch();
  const { navigate } = useContext(NavContext);

  const getQuadratsList = () => sample.samples.slice().sort(byDate);

  const getQuadratPhoto = (smp: Sample) => {
    const pic = smp.media.length && smp.media[0].getURL();

    const photo = pic ? (
      <img src={pic} className="object-cover size-full" />
    ) : (
      <IonIcon icon={leaf} />
    );

    return <div className="list-avatar mr-2">{photo}</div>;
  };

  const getList = () => {
    const quadrats = getQuadratsList();

    if (!quadrats.length) {
      return (
        <InfoBackgroundMessage>
          You have not added any quadrats yet.
        </InfoBackgroundMessage>
      );
    }

    const getQuadrat = (quadratSample: Sample) => (
      <IonItem
        key={quadratSample.cid}
        routerLink={`${match.url}/quadrat/${quadratSample.cid}`}
        {...getCompletionProps(quadratSample)}
      >
        <div className="px-1 py-2 w-full flex items-center">
          {getQuadratPhoto(quadratSample)}

          <b>{quadratSample.getPrettyName()}</b>
        </div>
      </IonItem>
    );

    return (
      <IonList className="quadrats-list" lines="full">
        <div className="rounded-list">
          <div className="list-divider justify-between p-2">
            <div>Quadrats</div>
            {sample.samples.length}
          </div>

          {quadrats.map(getQuadrat)}
        </div>
      </IonList>
    );
  };

  const isComplete = sample.metadata.saved || sample.isDisabled; // disabled for backwards compatibility

  const baseUrl = match.url.split('/').slice(0, -1).join('/');
  return (
    <Main className="pb-ion-s-10">
      <IonList lines="full">
        <div className="rounded-list my-2">
          {isDisabled && <UploadedRecordInfoMessage />}
        </div>

        {isComplete && (
          <Button
            color="secondary"
            className="bg-secondary-600 mx-auto my-5"
            onPress={() => navigate(`${baseUrl}/report`)}
          >
            See Report
          </Button>
        )}
      </IonList>

      {getList()}
    </Main>
  );
};

export default observer(MainComponent);
