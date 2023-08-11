import { FC } from 'react';
import { observer } from 'mobx-react';
import {
  bookOutline,
  clipboardOutline,
  informationCircleOutline,
  locationOutline,
  openOutline,
  timeOutline,
} from 'ionicons/icons';
import { useRouteMatch } from 'react-router-dom';
import {
  CounterInput,
  Main,
  MenuAttrItem,
  MenuAttrItemFromModel,
  MenuAttrToggle,
} from '@flumens';
import {
  IonIcon,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
} from '@ionic/react';
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
          <IonItem
            href="https://www.youtube.com/watch?v=UVC_VykDy2o"
            detail
            detailIcon={openOutline}
          >
            <IonIcon
              icon={informationCircleOutline}
              size="small"
              slot="start"
            />
            <IonLabel class="ion-text-wrap">
              Click here to watch a video on how to setup pitfall traps.
            </IonLabel>
          </IonItem>
          <IonItem
            href="https://www.rothamsted.ac.uk/sites/default/files/How%20to%20pitfall%20trap%20on%20your%20farm.pdf"
            detail
            detailIcon={openOutline}
          >
            <IonIcon icon={bookOutline} size="small" slot="start" />
            <IonLabel class="ion-text-wrap">
              Click here for the guidance documents.
            </IonLabel>
          </IonItem>
        </div>
      </IonList>

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

          <MenuAttrToggle
            icon={clipboardOutline}
            // TODO: use config
            label="Insecticides used"
            value={sample.attrs?.fieldInsecticides}
            onChange={(val: boolean) => {
              sample.attrs.fieldInsecticides = val; // eslint-disable-line
              sample.save();
            }}
            disabled={isDisabled}
          />
          <MenuAttrToggle
            icon={clipboardOutline}
            // TODO: use config
            label="Herbicides used"
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
          <MenuAttrToggle
            icon={clipboardOutline}
            label="Companion cropping"
            value={sample.attrs?.fieldCompanionCropping}
            onChange={(val: boolean) => {
              sample.attrs.fieldCompanionCropping = val; // eslint-disable-line
              sample.save();
            }}
            disabled={isDisabled}
          />
          <MenuAttrToggle
            icon={clipboardOutline}
            label="Intercropping"
            value={sample.attrs?.fieldIntercropping}
            onChange={(val: boolean) => {
              sample.attrs.fieldIntercropping = val; // eslint-disable-line
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
