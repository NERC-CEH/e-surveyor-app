import { FC } from 'react';
import { observer } from 'mobx-react';
import { clipboardOutline, locationOutline, timeOutline } from 'ionicons/icons';
import { useRouteMatch } from 'react-router-dom';
import {
  CounterInput,
  Main,
  MenuAttrItem,
  MenuAttrItemFromModel,
  MenuAttrToggle,
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

  const prettyGridRef = sample.attrs.location && (
    <GridRefValue sample={sample} />
  );

  return (
    <Main>
      <IonList lines="full">
        <div className="rounded">
          <MenuAttrItemFromModel attr="date" model={sample} />
          <MenuAttrItem
            routerLink={`${match.url}/map`}
            value={prettyGridRef}
            icon={locationOutline}
            label="Location"
            skipValueTranslation
            disabled={isDisabled}
            required
          />
          <MenuAttrItemFromModel attr="farm" model={sample} />
          <CounterInput
            label="Trapping period"
            onChange={onChangeTrapOutside}
            value={trapDays}
            icon={timeOutline}
            min={1}
            isDisabled={isDisabled}
            valueLabel={
              <span className="opacity-70">
                {`${trapDays}` === '1' ? 'day' : 'days'}
              </span>
            }
          />
        </div>

        <IonItemDivider mode="ios">Field</IonItemDivider>
        <div className="rounded">
          <MenuAttrItemFromModel attr="fieldName" model={sample} />
          <MenuAttrItemFromModel attr="fieldCrop" model={sample} />
          <MenuAttrItemFromModel attr="fieldMargins" model={sample} />
          <MenuAttrItemFromModel attr="fieldTillage" model={sample} />
          <MenuAttrToggle
            icon={clipboardOutline}
            label="Insecticides use"
            value={sample.attrs?.fieldInsecticides}
            onChange={(val: boolean) => {
              sample.attrs.fieldInsecticides = val; // eslint-disable-line
              sample.save();
            }}
            disabled={isDisabled}
          />
          <MenuAttrToggle
            icon={clipboardOutline}
            label="Herbicides use"
            value={sample.attrs?.fieldHerbicides}
            onChange={(val: boolean) => {
              sample.attrs.fieldHerbicides = val; // eslint-disable-line
              sample.save();
            }}
            disabled={isDisabled}
          />
          <MenuAttrToggle
            icon={clipboardOutline}
            label="Undersowing"
            value={sample.attrs?.fieldUndersowing}
            onChange={(val: boolean) => {
              sample.attrs.fieldUndersowing = val; // eslint-disable-line
              sample.save();
            }}
            disabled={isDisabled}
          />
        </div>
      </IonList>
    </Main>
  );
};

export default observer(MainComponent);
