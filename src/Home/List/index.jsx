import React from 'react';
import {
  IonList,
  IonItem,
  IonTitle,
  IonIcon,
  IonButton,
  IonButtons,
  IonToolbar,
  IonHeader,
} from '@ionic/react';
import { Page, Main } from '@apps';
import { observer } from 'mobx-react';
import { menu } from 'ionicons/icons';
import PropTypes from 'prop-types';
import Survey from './components/Survey';
import './styles.scss';
import './empty-samples-list-icon.svg';

function byDate(smp1, smp2) {
  const date1 = new Date(smp1.attrs.date);
  const date2 = new Date(smp2.attrs.date);
  return date2.getTime() - date1.getTime();
}

@observer
class Component extends React.Component {
  static propTypes = {
    savedSamples: PropTypes.array.isRequired,
  };

  getSamplesList() {
    const { savedSamples } = this.props;

    return savedSamples.sort(byDate);
  }

  getList = surveys => {
    if (!surveys.length) {
      return (
        <>
          <IonList lines="full">
            <IonItem className="empty">
              <div>
                You have no finished suveys.
                <br />
                <br />
                Press
                <IonIcon src="/images/route.svg" /> to add.
              </div>
            </IonItem>
          </IonList>
        </>
      );
    }

    const showSamplesEntities = sample => (
      <Survey key={sample.cid} sample={sample} />
    );

    return <IonList lines="full">{surveys.map(showSamplesEntities)}</IonList>;
  };

  render() {
    const surveys = this.getSamplesList();

    return (
      <Page id="surveys-list">
        <IonHeader className="ion-no-border">
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton routerLink="/info/menu">
                <IonIcon slot="icon-only" icon={menu} />
              </IonButton>
            </IonButtons>
            <IonTitle mode="ios">E-Surveyor</IonTitle>
          </IonToolbar>
        </IonHeader>

        <Main className="ion-padding" slot="fixed">
          {this.getList(surveys)}
        </Main>
      </Page>
    );
  }
}

export default Component;
