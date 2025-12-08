import { useState } from 'react';
import { observer } from 'mobx-react';
import {
  bookOutline,
  locationOutline,
  openOutline,
  playCircleOutline,
} from 'ionicons/icons';
import { useRouteMatch } from 'react-router-dom';
import {
  Block,
  Button,
  Main,
  MenuAttrItem,
  MenuAttrItemFromModel,
} from '@flumens';
import { IonIcon, IonList } from '@ionic/react';
import beetleIcon from 'common/images/beetle.svg';
import Sample from 'models/sample';
import GridRefValue from 'Survey/common/Components/GridRefValue';
import BeetleGuide from '../common/BeetleGuide';
import {
  fieldNameAttr,
  farmNameAttr,
  trapDaysAttr,
  fieldCropAttr,
  fieldCropOtherValue,
  fieldCropOtherAttr,
  fieldMarginsAttr,
  fieldMarginsHabitatAttr,
  fieldTillageAttr,
  fieldTillageOtherValue,
  fieldTillageOtherAttr,
  fieldNonCropHabitatsAttr,
  fieldNonCropHabitatsOtherAttr,
  fieldInsecticidesAttr,
  fieldHerbicidesAttr,
  fieldUndersowingAttr,
  fieldCompanionCroppingAttr,
  fieldIntercroppingAttr,
  fieldNonCropHabitatsOtherValue,
} from '../config';

type Props = {
  sample: Sample;
};

const MainComponent = ({ sample }: Props) => {
  const [showGuide, setShowGuide] = useState(false);

  const match = useRouteMatch();

  const isDisabled = sample.isUploaded;

  const prettyGridRef = sample.data.location && (
    <GridRefValue sample={sample} />
  );

  const recordAttrs = {
    record: sample.data,
    isDisabled,
  };

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

            <Block block={farmNameAttr} {...recordAttrs} />
            <Block block={trapDaysAttr} {...recordAttrs} />
          </div>

          <h3 className="list-title">Field</h3>
          <div className="rounded-list">
            <Block block={fieldNameAttr} {...recordAttrs} />
            <Block block={fieldCropAttr} {...recordAttrs} />
            {sample.data[fieldCropAttr.id] === fieldCropOtherValue && (
              <Block block={fieldCropOtherAttr} {...recordAttrs} />
            )}
            <Block block={fieldMarginsAttr} {...recordAttrs} />
            <Block block={fieldMarginsHabitatAttr} {...recordAttrs} />
            <Block block={fieldTillageAttr} {...recordAttrs} />
            {sample.data[fieldTillageAttr.id] === fieldTillageOtherValue && (
              <Block block={fieldTillageOtherAttr} {...recordAttrs} />
            )}

            <Block block={fieldNonCropHabitatsAttr} {...recordAttrs} />
            {sample.data[fieldNonCropHabitatsAttr.id]?.includes(
              fieldNonCropHabitatsOtherValue
            ) && (
              <Block block={fieldNonCropHabitatsOtherAttr} {...recordAttrs} />
            )}

            <Block block={fieldInsecticidesAttr} {...recordAttrs} />
            <Block block={fieldHerbicidesAttr} {...recordAttrs} />
            <Block block={fieldUndersowingAttr} {...recordAttrs} />
            <Block block={fieldCompanionCroppingAttr} {...recordAttrs} />
            <Block block={fieldIntercroppingAttr} {...recordAttrs} />
          </div>
        </IonList>
      </Main>

      <BeetleGuide isOpen={showGuide} onClose={() => setShowGuide(false)} />
    </>
  );
};

export default observer(MainComponent);
