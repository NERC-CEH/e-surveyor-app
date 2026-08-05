import { observer } from 'mobx-react';
import clsx from 'clsx';
import { leaf, checkmark, alertCircleOutline } from 'ionicons/icons';
import { useRouteMatch } from 'react-router-dom';
import { Main } from '@flumens';
import { IonItem, IonIcon } from '@ionic/react';
import useHeaderScroll from 'common/helpers/useHeaderScroll';
import Sample from 'models/sample';
import StarsBackground from 'Survey/common/Components/StarsBackground';
import {
  bareGroundAttr,
  commentAttr,
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

  return (
    hasQuadratPhoto ||
    hasSpecies ||
    hasCoverData ||
    !!quadratSample.data[commentAttr.id]
  );
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
};

const MainComponent = ({ sample }: Props) => {
  const match = useRouteMatch();
  const mainProps = useHeaderScroll();

  const getQuadratPhoto = (smp: Sample) => {
    const pic = smp.media.length && smp.media[0].getURL();

    const photo = pic ? (
      <img src={pic} className="object-cover size-full" />
    ) : (
      <IonIcon icon={leaf} />
    );

    return <div className="list-avatar mr-2">{photo}</div>;
  };

  const quadrats = sample.samples.slice().sort(byDate);

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
    <Main {...mainProps} className="pb-ion-s-10">
      <StarsBackground />

      <div className="list">
        <div className="card p-0! overflow-hidden top">
          <div className="list-divider justify-between p-2">
            <div>Quadrats</div>
            {sample.samples.length}
          </div>

          {quadrats.map(getQuadrat)}
        </div>
      </div>
    </Main>
  );
};

export default observer(MainComponent);
