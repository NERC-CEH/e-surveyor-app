import React from 'react';
import { IonList, IonItem, IonIcon } from '@ionic/react';
import { Main } from '@apps';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Survey from './components/Survey';
import './styles.scss';
import './empty-samples-list-icon.svg';
import logo from './logo.png';

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

    return savedSamples.slice().sort(byDate);
  }

  getList = surveys => {
    if (!surveys.length) {
      return (
        <IonList lines="none">
          <IonItem className="empty">
            <div>
              You have no finished surveys.
              <br />
              <br />
              Press
              <IonIcon src="/images/route.svg" /> to add.
            </div>
          </IonItem>
        </IonList>
      );
    }

    const showSamplesEntities = sample => (
      <Survey key={sample.cid} sample={sample} />
    );

    return <IonList lines="none">{surveys.map(showSamplesEntities)}</IonList>;
  };

  render() {
    const surveys = this.getSamplesList();

    return (
      <Main className="ion-padding" slot="fixed">
        <img src={logo} alt="" />
        {this.getList(surveys)}
      </Main>
    );
  }
}

export default Component;
