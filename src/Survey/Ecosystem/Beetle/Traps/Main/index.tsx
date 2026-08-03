import { observer } from 'mobx-react';
import { addOutline } from 'ionicons/icons';
import { Button, Main } from '@flumens';
import { IonList, IonIcon } from '@ionic/react';
import { byDate } from 'models/collections/samples';
import Sample from 'models/sample';
import InfoBackgroundMessage from 'Components/InfoBackgroundMessage';
import UploadedRecordInfoMessage from 'Survey/common/Components/UploadedRecordInfoMessage';
import Trap from './Trap';
import './styles.scss';

type Props = {
  sample: Sample;
  onAddNewTrap: () => void;
  onTrapDelete: (trapSample: Sample) => void;
};

const MainComponent = ({ sample, onAddNewTrap, onTrapDelete }: Props) => {
  const isDisabled = sample.isUploaded;

  const getList = () => {
    const traps = sample.samples.slice().sort(byDate);

    if (!traps.length) {
      return (
        <InfoBackgroundMessage>
          You have not added any traps yet.
        </InfoBackgroundMessage>
      );
    }

    return (
      <IonList className="traps-list" lines="full">
        <div className="rounded-list">
          <div className="list-divider">
            <div>Traps</div>
            <div>{sample.samples.length}</div>
          </div>
          {traps.map((smp: Sample) => (
            <Trap key={smp.cid} sample={smp} onTrapDelete={onTrapDelete} />
          ))}
        </div>
      </IonList>
    );
  };

  return (
    <Main>
      <div className="mb-2 list">
        <div className="rounded-list my-2">
          {isDisabled && <UploadedRecordInfoMessage />}
        </div>
      </div>

      {!isDisabled && (
        <Button
          onPress={onAddNewTrap}
          color="secondary"
          prefix={<IonIcon icon={addOutline} className="size-6" />}
          className="bg-secondary-600 mx-auto mt-7 mb-3"
        >
          Add Trap
        </Button>
      )}

      {getList()}
    </Main>
  );
};

export default observer(MainComponent);
