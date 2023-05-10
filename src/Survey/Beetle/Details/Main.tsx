import { FC } from 'react';
import { observer } from 'mobx-react';
import { locationOutline, timeOutline } from 'ionicons/icons';
import { useRouteMatch } from 'react-router-dom';
import {
  CounterInput,
  Main,
  MenuAttrItem,
  MenuAttrItemFromModel,
} from '@flumens';
import { IonItemDivider, IonList } from '@ionic/react';
import Sample from 'models/sample';
import GridRefValue from 'Survey/common/Components/GridRefValue';

type Props = {
  sample: Sample;
  onChangeTrapOutside: (value: number) => void;
};

const MainComponent: FC<Props> = ({ sample, onChangeTrapOutside }) => {
  const match = useRouteMatch();

  const { trapDays } = sample.attrs;
  const isDisabled = sample.isUploaded();

  const prettyGridRef = <GridRefValue sample={sample} />;

  return (
    <Main>
      <IonList lines="full">
        <div className="rounded">
          <MenuAttrItem
            routerLink={`${match.url}/map`}
            value={prettyGridRef}
            icon={locationOutline}
            label="Location"
            skipValueTranslation
            disabled={isDisabled}
          />
          <MenuAttrItemFromModel attr="farm" model={sample} />
          <CounterInput
            label="Trap outside"
            onChange={onChangeTrapOutside}
            value={trapDays}
            icon={timeOutline}
            min={1}
            isDisabled={isDisabled}
          />
        </div>

        <IonItemDivider mode="ios">Field</IonItemDivider>
        <div className="rounded">
          <div className="rounded-md bg-white p-2 text-sm">WIP</div>
          {/* <MenuAttrItem
            routerLink={`${match.url}/type`}
            value={type || ''}
            icon={transectIcon}
            label="Type"
            skipValueTranslation
            disabled={isDisabled || completedDetails}
          /> */}
        </div>
      </IonList>
    </Main>
  );
};

export default observer(MainComponent);
