import { useContext } from 'react';
import { observer } from 'mobx-react';
import { leaf } from 'ionicons/icons';
import { useRouteMatch } from 'react-router-dom';
import { Main, Button } from '@flumens';
import { IonList, IonItem, IonIcon, NavContext } from '@ionic/react';
import Sample from 'models/sample';
import InfoBackgroundMessage from 'Components/InfoBackgroundMessage';
import UploadedRecordInfoMessage from 'Survey/common/Components/UploadedRecordInfoMessage';

function byDate(smp1: Sample, smp2: Sample) {
  const date1 = new Date(smp1.data.date);
  const date2 = new Date(smp2.data.date);
  return date2.getTime() - date1.getTime();
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
        className="ps-ion-1"
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
