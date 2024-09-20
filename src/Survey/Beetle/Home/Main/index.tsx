import { observer } from 'mobx-react';
import { createOutline, leaf, cameraOutline } from 'ionicons/icons';
import { useRouteMatch } from 'react-router-dom';
import { Button, Main, MenuAttrItem } from '@flumens';
import {
  IonList,
  IonItem,
  IonIcon,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
} from '@ionic/react';
import Sample from 'models/sample';
import InfoBackgroundMessage from 'Components/InfoBackgroundMessage';
import UploadedRecordInfoMessage from 'Survey/common/Components/UploadedRecordInfoMessage';
import './styles.scss';

function byDate(smp1: Sample, smp2: Sample) {
  const date1 = new Date(smp1.attrs.date);
  const date2 = new Date(smp2.attrs.date);
  return date2.getTime() - date1.getTime();
}

type Props = {
  sample: Sample;
  onAddNewTrap: () => void;
  onTrapDelete: (trapSample: Sample) => void;
};

const MainComponent = ({ sample, onAddNewTrap, onTrapDelete }: Props) => {
  const match = useRouteMatch();
  const isDisabled = sample.isUploaded();

  const getTrapPhoto = (smp: Sample) => {
    const pic = smp.media[0]?.getURL();

    const photo = pic ? <img src={pic} /> : <IonIcon icon={leaf} />;

    return <div className="list-avatar">{photo}</div>;
  };

  const getList = () => {
    const traps = sample.samples.slice().sort(byDate);

    if (!traps.length) {
      return (
        <InfoBackgroundMessage>
          You have not added any traps yet.
        </InfoBackgroundMessage>
      );
    }

    const getTrap = (trapSample: Sample) => (
      <IonItemSliding key={trapSample.cid}>
        <IonItem routerLink={`${match.url}/trap/${trapSample.cid}`} detail>
          <div className="flex items-center gap-2">
            {getTrapPhoto(trapSample)}
            <h3>{trapSample.getPrettyName()}</h3>
          </div>
        </IonItem>

        {!isDisabled && (
          <IonItemOptions side="end">
            <IonItemOption
              color="danger"
              onClick={() => onTrapDelete(trapSample)}
            >
              Delete
            </IonItemOption>
          </IonItemOptions>
        )}
      </IonItemSliding>
    );

    return (
      <IonList className="traps-list" lines="full">
        <div className="rounded-list">
          <div className="list-divider">
            <div>Traps</div>
            <div>{sample.samples.length}</div>
          </div>
          {traps.map(getTrap)}
        </div>
      </IonList>
    );
  };

  return (
    <Main>
      <IonList lines="full" className="mb-2 flex flex-col gap-4">
        <div className="rounded-list">
          {isDisabled && <UploadedRecordInfoMessage />}
        </div>

        <div className="rounded-list">
          <MenuAttrItem
            routerLink={`${match.url}/details`}
            icon={createOutline}
            label="Details"
            skipValueTranslation
          />
        </div>
      </IonList>

      {!isDisabled && (
        <Button
          onPress={onAddNewTrap}
          color="secondary"
          prefix={<IonIcon icon={cameraOutline} className="size-6" />}
          className="mx-auto my-4"
        >
          Add Trap
        </Button>
      )}

      {getList()}
    </Main>
  );
};

export default observer(MainComponent);
