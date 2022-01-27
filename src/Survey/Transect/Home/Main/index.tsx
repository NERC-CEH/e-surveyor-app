import React, { FC } from 'react';
import { observer } from 'mobx-react';
import {
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonItemDivider,
} from '@ionic/react';
import {
  createOutline,
  leaf,
  bookmarkOutline,
  informationCircleOutline,
} from 'ionicons/icons';
import { Main, MenuAttrItem, InfoMessage } from '@flumens';
import Sample from 'models/sample';
import { useRouteMatch } from 'react-router-dom';
import './styles.scss';

function byDate(smp1: typeof Sample, smp2: typeof Sample) {
  const date1 = new Date(smp1.attrs.date);
  const date2 = new Date(smp2.attrs.date);
  return date2.getTime() - date1.getTime();
}

type Props = {
  sample: typeof Sample;
  onAddNewQuadrat: () => void;
  isDisabled?: boolean;
};

const MainComponent: FC<Props> = ({ sample, isDisabled, onAddNewQuadrat }) => {
  const match = useRouteMatch();

  const getQuadratsList = () => {
    return sample.samples.slice().sort(byDate);
  };

  const getQuadratPhoto = (smp: typeof Sample) => {
    const pic = smp.media.length && smp.media[0].getURL();

    const photo = pic ? <img src={pic} /> : <IonIcon icon={leaf} />;

    return <div className="photo">{photo}</div>;
  };

  const getList = () => {
    const quadrats = getQuadratsList();

    if (!quadrats.length) {
      return (
        <IonList lines="none">
          <IonItem className="empty">
            <div>You have not added any quadrats yet.</div>
          </IonItem>
        </IonList>
      );
    }

    const getQuadrat = (quadratSample: typeof Sample) => (
      <IonItem
        key={quadratSample.cid}
        routerLink={`${match.url}/quadrat/${quadratSample.cid}`}
        detail
      >
        {getQuadratPhoto(quadratSample)}

        <IonLabel text-wrap>
          <IonLabel>
            <b>{quadratSample.getPrettyName()}</b>
          </IonLabel>
        </IonLabel>
      </IonItem>
    );

    return (
      <IonList className="quadrats-list" lines="full">
        <IonItemDivider mode="ios">
          Quadrats
          <IonLabel slot="end">{`${sample.samples.length}/${sample.attrs.steps}`}</IonLabel>
        </IonItemDivider>

        <div className="rounded">{quadrats.map(getQuadrat)}</div>
      </IonList>
    );
  };

  const getAddButton = () => {
    if (isDisabled) {
      return null;
    }

    if (sample.samples.length >= sample.attrs.steps) {
      return null;
    }

    return (
      <IonButton
        onClick={onAddNewQuadrat}
        color="secondary"
        type="submit"
        expand="block"
      >
        Add Quadrat
      </IonButton>
    );
  };

  const isComplete = sample.metadata.saved || sample.isDisabled(); // disabled for backwards compatibility

  return (
    <Main>
      <br />

      <IonList lines="full">
        {isDisabled && (
          <InfoMessage icon={informationCircleOutline}>
            This survey has been finished and cannot be updated.
          </InfoMessage>
        )}

        {isComplete && (
          <IonButton
            color="secondary"
            type="submit"
            expand="block"
            routerLink={`${match.url}/report`}
          >
            See Report
          </IonButton>
        )}

        <div className="rounded">
          <MenuAttrItem
            routerLink={`${match.url}/details`}
            icon={createOutline}
            value={sample.attrs.type}
            label="Details"
            skipValueTranslation
            disabled={isDisabled}
          />
          <MenuAttrItem
            routerLink={`${match.url}/name`}
            icon={bookmarkOutline}
            value={sample.attrs.name}
            label="Name"
            skipValueTranslation
            disabled={isDisabled}
          />
        </div>
      </IonList>

      {getAddButton()}

      {getList()}
    </Main>
  );
};

export default observer(MainComponent);
