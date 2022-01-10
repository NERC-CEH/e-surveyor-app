import React, { FC } from 'react';
import { IonList, IonItem, IonIcon } from '@ionic/react';
import { Main } from '@flumens';
import { observer } from 'mobx-react';
import Sample from 'models/sample';
import pointIcon from 'common/images/pointIcon.svg';
import Survey from './components/Survey';
import logo from './images/logo.png';
import './images/empty-samples-list-icon.svg';
import './styles.scss';

function byDate(smp1: typeof Sample, smp2: typeof Sample) {
  const date1 = new Date(smp1.attrs.date);
  const date2 = new Date(smp2.attrs.date);
  return date2.getTime() - date1.getTime();
}

type Props = {
  savedSamples: typeof Sample[];
};

const HomeMain: FC<Props> = ({ savedSamples }) => {
  const getSamplesList = () => savedSamples.slice().sort(byDate);

  const getList = () => {
    const surveys = getSamplesList();

    if (!surveys.length) {
      return (
        <IonList lines="none">
          <IonItem className="empty">
            <div>
              You have no finished surveys.
              <br />
              <br />
              Press
              <IonIcon icon={pointIcon} /> to add.
            </div>
          </IonItem>
        </IonList>
      );
    }

    const showSamplesEntities = (sample: typeof Sample) => (
      <Survey key={sample.cid} sample={sample} />
    );

    return <IonList lines="none">{surveys.map(showSamplesEntities)}</IonList>;
  };

  return (
    <Main className="ion-padding" slot="fixed">
      <img src={logo} alt="" />
      {getList()}
    </Main>
  );
};

export default observer(HomeMain);
