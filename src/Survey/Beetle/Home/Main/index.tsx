import { observer } from 'mobx-react';
import { createOutline, cameraOutline } from 'ionicons/icons';
import { useRouteMatch } from 'react-router-dom';
import { Button, Main, MenuAttrItem } from '@flumens';
import { IonList, IonIcon } from '@ionic/react';
import { byDate } from 'common/models/samples';
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
  const match = useRouteMatch();
  const isDisabled = sample.isUploaded();

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
            <Trap sample={smp} onTrapDelete={onTrapDelete} />
          ))}
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
          className="mx-auto mb-3 mt-7"
        >
          Add Trap
        </Button>
      )}

      {getList()}
    </Main>
  );
};

export default observer(MainComponent);
