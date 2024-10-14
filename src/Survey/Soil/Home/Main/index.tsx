import { useContext } from 'react';
import { addOutline, locationOutline, mapOutline } from 'ionicons/icons';
import { useRouteMatch } from 'react-router-dom';
import { Main, MenuAttrItem, Block, Button } from '@flumens';
import { IonList, IonItem, IonIcon, IonLabel, NavContext } from '@ionic/react';
import InfoBackgroundMessage from 'common/Components/InfoBackgroundMessage';
import { byDate } from 'common/models/samples';
import Sample from 'models/sample';
import GridRefValue from 'Survey/common/Components/GridRefValue';
import MenuDateAttr from 'Survey/common/Components/MenuDateAttr';
import soil from '../../common/soil.svg';
import tractor from '../../common/tractor.svg';
import { farmNameAttr, fieldNameAttr } from '../../config';
import SampleEntry from './Sample';

type Props = {
  sample: Sample;
  onSampleDelete: (smp: Sample) => void;
  onSampleAdd: () => void;
};

const MainSoilHome = ({ sample, onSampleDelete, onSampleAdd }: Props) => {
  const { navigate } = useContext(NavContext);
  const { url } = useRouteMatch();

  const recordAttrs = {
    record: sample.attrs,
  };

  const getList = () => {
    const samples = sample.samples.slice().sort(byDate);
    if (!samples.length) {
      return (
        <InfoBackgroundMessage>
          You have not added any samples yet.
        </InfoBackgroundMessage>
      );
    }

    return (
      <IonList lines="full">
        <div className="rounded-list">
          <div className="list-divider">
            <div>Samples</div>
            <div>{sample.samples.length}</div>
          </div>
          {samples.map((smp: Sample) => (
            <SampleEntry key={smp.cid} sample={smp} onDelete={onSampleDelete} />
          ))}
        </div>
      </IonList>
    );
  };

  return (
    <Main className="[--padding-bottom:50px]">
      <IonList lines="full">
        <div className="list-title">Details</div>
        <div className="rounded-list">
          <MenuDateAttr {...recordAttrs} />
          <MenuAttrItem
            routerLink={`${url}/location`}
            icon={locationOutline}
            label="Location"
            skipValueTranslation
            value={<GridRefValue sample={sample} />}
          />
          <Block block={farmNameAttr} {...recordAttrs} />
          <Block block={fieldNameAttr} {...recordAttrs} />
          <IonItem routerLink={`${url}/management`}>
            <IonIcon src={tractor} slot="start" />
            <IonLabel>Management</IonLabel>
          </IonItem>
          <IonItem routerLink={`${url}/som`}>
            <IonIcon src={soil} slot="start" />
            <IonLabel>SOM</IonLabel>
          </IonItem>
        </div>
      </IonList>

      <div className="mb-4 mt-8 flex items-center justify-center gap-8">
        <Button
          onPress={onSampleAdd}
          color="secondary"
          prefix={<IonIcon icon={addOutline} className="size-6" />}
        >
          Add Sample
        </Button>

        <Button
          onPress={() => navigate(`${url}/past-locations`)}
          fill="outline"
          className="px-4"
          prefix={<IonIcon src={mapOutline} className="size-5" />}
        >
          Map
        </Button>
      </div>

      {getList()}
    </Main>
  );
};

export default MainSoilHome;
