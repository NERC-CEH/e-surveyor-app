/* eslint-disable camelcase */
import React from 'react';
import { observer } from 'mobx-react';
import { IonItem, IonList } from '@ionic/react';
import { Main } from '@apps';

import './styles.scss';

@observer
class MainComponent extends React.Component {
  static propTypes = {};

  render() {
    return (
      <>
        <Main>
          <IonList lines="full">
            <IonItem className="report-header" lines="none">
              Sorry, this is work in progress.
            </IonItem>
          </IonList>
        </Main>
      </>
    );
  }
}

export default MainComponent;
