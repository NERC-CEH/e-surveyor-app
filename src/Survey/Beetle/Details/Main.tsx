import { observer } from 'mobx-react';
import {
  bookOutline,
  clipboardOutline,
  locationOutline,
  openOutline,
  timeOutline,
} from 'ionicons/icons';
import { useRouteMatch } from 'react-router-dom';
import {
  Button,
  CounterInput,
  Input,
  Main,
  MenuAttrItem,
  MenuAttrItemFromModel,
  Toggle,
} from '@flumens';
import { IonIcon, IonList } from '@ionic/react';
import Sample from 'models/sample';
import GridRefValue from 'Survey/common/Components/GridRefValue';

const clipboardIcon = <IonIcon src={clipboardOutline} className="size-6 " />;

type Props = {
  sample: Sample;
  onChangeTrapOutside: (value: number) => void;
};

const MainComponent = ({ sample, onChangeTrapOutside }: Props) => {
  const match = useRouteMatch();

  const { trapDays } = sample.attrs;
  const isDisabled = sample.isUploaded();

  const prettyGridRef = sample.attrs.location && (
    <GridRefValue sample={sample} />
  );

  return (
    <Main>
      <div className="mx-auto flex max-w-2xl flex-col gap-1 pb-5">
        <Button
          href="https://www.youtube.com/watch?v=UVC_VykDy2o"
          prefix={<IonIcon icon={bookOutline} size="small" />}
          suffix={<IonIcon icon={openOutline} size="small" />}
          className="mx-3 text-left"
        >
          Click here to watch a video on how to setup pitfall traps.
        </Button>
        <Button
          href="https://www.rothamsted.ac.uk/sites/default/files/How%20to%20pitfall%20trap%20on%20your%20farm.pdf"
          prefix={<IonIcon icon={bookOutline} size="small" />}
          suffix={<IonIcon icon={openOutline} size="small" />}
          className="mx-3 text-left"
        >
          Click here for the guidance documents.
        </Button>
      </div>

      <IonList lines="full">
        <div className="rounded-list">
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
          <Input
            label="Farm name"
            prefix={<IonIcon src={locationOutline} className="size-6" />}
            value={sample.attrs.farm}
            onChange={(val: string) => (sample.attrs.farm = val)} // eslint-disable-line
          />
          <CounterInput
            label="Trapping period"
            onChange={onChangeTrapOutside}
            value={trapDays}
            prefix={<IonIcon src={timeOutline} className="size-6" />}
            minValue={1}
            suffix={`${trapDays}` === '1' ? 'day' : 'days'}
          />
        </div>

        <h3 className="list-title">Field</h3>
        <div className="rounded-list">
          <Input
            label="Name"
            prefix={<IonIcon src={clipboardOutline} className="size-6" />}
            value={sample.attrs.fieldName}
            onChange={(val: string) => (sample.attrs.fieldName = val)} // eslint-disable-line
          />
          <MenuAttrItemFromModel attr="fieldCrop" model={sample} />
          {sample.attrs.fieldCrop === 'Other' && (
            <MenuAttrItemFromModel attr="fieldCropOther" model={sample} />
          )}
          <MenuAttrItemFromModel attr="fieldMargins" model={sample} />
          <MenuAttrItemFromModel attr="fieldMarginsHabitat" model={sample} />
          <MenuAttrItemFromModel attr="fieldTillage" model={sample} />
          {sample.attrs.fieldTillage === 'Other' && (
            <MenuAttrItemFromModel attr="fieldTillageOther" model={sample} />
          )}
          <MenuAttrItemFromModel attr="fieldNonCropHabitats" model={sample} />
          {sample.attrs.fieldNonCropHabitats?.includes('Other') && (
            <MenuAttrItemFromModel
              attr="fieldNonCropHabitatsOther"
              model={sample}
            />
          )}
          <Toggle
            prefix={clipboardIcon}
            label="Insecticides used"
            defaultSelected={sample.attrs.fieldInsecticides}
            onChange={(val: boolean) => (sample.attrs.fieldInsecticides = val)} // eslint-disable-line
          />
          <Toggle
            prefix={clipboardIcon}
            label="Herbicides used"
            defaultSelected={sample.attrs.fieldHerbicides}
            onChange={(val: boolean) => (sample.attrs.fieldHerbicides = val)} // eslint-disable-line
          />
          <Toggle
            prefix={clipboardIcon}
            label="Undersowing"
            defaultSelected={sample.attrs.fieldUndersowing}
            onChange={(val: boolean) => (sample.attrs.fieldUndersowing = val)} // eslint-disable-line
          />
          <Toggle
            prefix={clipboardIcon}
            label="Companion cropping"
            defaultSelected={sample.attrs.fieldCompanionCropping}
            onChange={
              (val: boolean) => (sample.attrs.fieldCompanionCropping = val) // eslint-disable-line
            }
          />
          <Toggle
            prefix={clipboardIcon}
            label="Intercropping"
            defaultSelected={sample.attrs.fieldIntercropping}
            onChange={(val: boolean) => (sample.attrs.fieldIntercropping = val)} // eslint-disable-line
          />
        </div>
      </IonList>
    </Main>
  );
};

export default observer(MainComponent);
