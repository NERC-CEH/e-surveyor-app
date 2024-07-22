/* eslint-disable no-param-reassign */
import { observer } from 'mobx-react';
import { Page, Header, Main } from '@flumens';
import { IonList } from '@ionic/react';
import Sample from 'models/sample';

interface Props {
  subSample: Sample;
}

const SOMLab = ({ subSample }: Props) => {
  console.log(subSample);

  return (
    <Page id="survey-soil-lab">
      <Header title="Lab" />
      <Main>
        <IonList lines="full">
          <div className="mt-5">Field: Date of Analysis </div>
          <div>Value: Date the lab report was received (date picker).</div>

          <div className="mt-5">Field: Lab Name</div>
          <div>Value: Name of the testing laboratory (text field).</div>

          <div className="mt-5">Field: SOM Percentage</div>
          <div>
            Value: Soil Organic Matter percentage from the lab report (number
            field).
          </div>

          <div className="mt-5">Field: Additional Lab Results (optional)</div>
          <div>
            Value: Option to upload the full lab report as a PDF (file upload).
          </div>
        </IonList>
      </Main>
    </Page>
  );
};

export default observer(SOMLab);
