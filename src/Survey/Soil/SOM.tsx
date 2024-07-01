/* eslint-disable no-param-reassign */
import { observer } from 'mobx-react';
import { Page, Header, Main } from '@flumens';
import { IonList } from '@ionic/react';

const VSA = () => {
  return (
    <Page id="survey-soil-som">
      <Header title="SOM" />
      <Main>
        <IonList lines="full">
          <div className="rounded-list">
            <div className="mt-5">Field: Sampling pattern</div>
            <div>Value: Drop-down [‘W’ pattern, Whole field, …]</div>

            <div className="mt-5">Field: Sample depth</div>
            <div>Value: Number - 0-200</div>

            <div className="mt-5">Field: Auger diameter</div>
            <div>Value: Number - 0-20</div>

            <div className="mt-5">Field: Stones</div>
            <div>Value: Percentage</div>

            <div className="mt-5">Field: Location </div>
            <div>Value: capture the five points of the ‘w’</div>

            <div className="mt-5">Button: Add sample</div>
            <div>Action: Creates sample ID, added to list below</div>
          </div>
        </IonList>
      </Main>
    </Page>
  );
};

export default observer(VSA);
