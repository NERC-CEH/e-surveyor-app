import { FC } from 'react';
import { observer } from 'mobx-react';
import {
  createOutline,
  leaf,
  informationCircleOutline,
  cameraOutline,
} from 'ionicons/icons';
import { useRouteMatch } from 'react-router-dom';
import {
  Main,
  MenuAttrItem,
  InfoMessage,
  InfoBackgroundMessage,
} from '@flumens';
import {
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonItemDivider,
} from '@ionic/react';
import Sample from 'models/sample';
import './styles.scss';

function byDate(smp1: Sample, smp2: Sample) {
  const date1 = new Date(smp1.attrs.date);
  const date2 = new Date(smp2.attrs.date);
  return date2.getTime() - date1.getTime();
}

type Props = {
  sample: Sample;
  onAddNewTrap: () => void;
};

const MainComponent: FC<Props> = ({ sample, onAddNewTrap }) => {
  const match = useRouteMatch();
  const isDisabled = sample.isUploaded();

  const getTrapPhoto = (smp: Sample) => {
    const pic = smp.media[0]?.getURL();

    const photo = pic ? <img src={pic} /> : <IonIcon icon={leaf} />;

    return <div className="photo">{photo}</div>;
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
      <IonItem
        key={trapSample.cid}
        routerLink={`${match.url}/trap/${trapSample.cid}`}
        detail
      >
        {getTrapPhoto(trapSample)}

        <IonLabel text-wrap>
          <IonLabel>
            <b>{trapSample.getPrettyName()}</b>
          </IonLabel>
        </IonLabel>
      </IonItem>
    );

    return (
      <IonList className="traps-list" lines="full">
        <IonItemDivider mode="ios">
          Traps
          <IonLabel slot="end">{sample.samples.length}</IonLabel>
        </IonItemDivider>

        <div className="rounded">{traps.map(getTrap)}</div>
      </IonList>
    );
  };

  const isFinished = sample.metadata.saved;

  return (
    <Main>
      {isDisabled && (
        <InfoMessage icon={informationCircleOutline} className="blue">
          This survey has been finished and cannot be updated.
        </InfoMessage>
      )}

      <IonList lines="full">
        {isFinished && (
          <IonButton
            color="secondary"
            type="submit"
            expand="block"
            routerLink={`${match.url}/report`}
          >
            See Report
          </IonButton>
        )}

        <div className="rounded">
          <MenuAttrItem
            routerLink={`${match.url}/details`}
            icon={createOutline}
            label="Details"
            skipValueTranslation
            disabled={isDisabled}
          />
        </div>
      </IonList>

      {!isDisabled && (
        <IonButton
          onClick={onAddNewTrap}
          color="secondary"
          type="submit"
          expand="block"
          className="[--padding-end:40px] [--padding-start:40px]"
        >
          <IonIcon slot="start" icon={cameraOutline} size="large" />
          Add Trap
        </IonButton>
      )}

      {getList()}
    </Main>
  );
};

export default observer(MainComponent);
