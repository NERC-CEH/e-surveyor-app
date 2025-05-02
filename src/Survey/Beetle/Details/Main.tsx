import { useState } from 'react';
import { observer } from 'mobx-react';
import {
  bookOutline,
  clipboardOutline,
  locationOutline,
  openOutline,
  timeOutline,
  playCircleOutline,
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
import beetleIcon from 'common/images/beetle.svg';
import Sample from 'models/sample';
import GridRefValue from 'Survey/common/Components/GridRefValue';
import BeetleGuide from '../common/BeetleGuide';

const clipboardIcon = <IonIcon src={clipboardOutline} className="size-6" />;

type Props = {
  sample: Sample;
  onChangeTrapOutside: any;
};

const MainComponent = ({ sample, onChangeTrapOutside }: Props) => {
  const [showGuide, setShowGuide] = useState(false);

  const match = useRouteMatch();

  const { trapDays } = sample.attrs;
  const isDisabled = sample.isUploaded();

  const prettyGridRef = sample.attrs.location && (
    <GridRefValue sample={sample} />
  );

  return (
    <>
      <Main>
        <div className="mx-auto my-5 flex max-w-2xl flex-col gap-1">
          <Button
            href="https://www.youtube.com/watch?v=UVC_VykDy2o"
            prefix={<IonIcon icon={playCircleOutline} className="size-6" />}
            suffix={<IonIcon icon={openOutline} />}
            className="mx-3 text-left"
          >
            Pitfall trap setup video
          </Button>
          <Button
            href="https://www.rothamsted.ac.uk/sites/default/files/How%20to%20pitfall%20trap%20on%20your%20farm.pdf"
            prefix={<IonIcon icon={bookOutline} className="size-6" />}
            suffix={<IonIcon icon={openOutline} />}
            className="mx-3 text-left"
          >
            Guidance documents
          </Button>
          <Button
            prefix={<IonIcon icon={beetleIcon} className="size-6" />}
            className="mx-3 text-left"
            onPress={() => setShowGuide(true)}
          >
            Carabid identification guide
          </Button>
        </div>

        <IonList lines="full" className="mb-2">
          <h3 className="list-title">Details</h3>
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
              onChange={
                (val: boolean) => (sample.attrs.fieldInsecticides = val) // eslint-disable-line
              }
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
              onChange={
                (val: boolean) => (sample.attrs.fieldIntercropping = val) // eslint-disable-line
              }
            />
          </div>
        </IonList>
      </Main>

      <BeetleGuide isOpen={showGuide} onClose={() => setShowGuide(false)} />
    </>
  );
};

export default observer(MainComponent);
