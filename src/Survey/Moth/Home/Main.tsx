import { observer } from 'mobx-react';
import { calendarOutline, cameraOutline } from 'ionicons/icons';
import { useRouteMatch } from 'react-router';
import {
  Main,
  MenuAttrItem,
  Button,
  MenuAttrItemFromModel,
  toISOTimezoneString,
} from '@flumens';
import {
  IonList,
  IonIcon,
  IonItem,
  IonDatetimeButton,
  IonDatetime,
  IonLabel,
  IonModal,
} from '@ionic/react';
import mothInsideBoxIcon from 'common/images/moth-inside-icon.svg';
import Sample from 'models/sample';
import GridRefValue from 'Survey/common/Components/GridRefValue';
import SpeciesList from 'Survey/common/Components/SpeciesList';
import UploadedRecordInfoMessage from 'Survey/common/Components/UploadedRecordInfoMessage';

type Props = {
  sample: Sample;
  photoSelect: any;
  isDisabled: boolean;
};

const HomeMain = ({
  sample,
  isDisabled,
  photoSelect, // eslint-disable-line
}: Props) => {
  const { url } = useRouteMatch();

  return (
    <Main>
      {isDisabled && <UploadedRecordInfoMessage />}

      <IonList lines="full">
        <div className="rounded-list">
          <MenuAttrItem
            routerLink={`${url}/location`}
            icon={mothInsideBoxIcon}
            label="Moth trap"
            skipValueTranslation
            value={<GridRefValue sample={sample} />}
            disabled={isDisabled}
          />
          <IonItem className="m-0 rounded-none [--border-radius:0] [--border-style:solid] [--inner-padding-end:8px]">
            <IonIcon src={calendarOutline} slot="start" />
            <IonLabel>Survey time</IonLabel>
            <div className="flex items-center gap-1">
              <div>
                <IonDatetimeButton
                  datetime="surveyEndTime"
                  slot="end"
                  className="[--ion-color-step-300:rgba(var(--color-tertiary-800-rgb),0.04)] [--ion-text-color:var(--form-value-color)]"
                />
                <IonModal
                  keepContentsMounted
                  className="[--border-radius:10px]"
                >
                  <IonDatetime
                    id="surveyEndTime"
                    presentation="date-time"
                    preferWheel
                    onIonChange={(e: any) => {
                      // eslint-disable-next-line
                      (sample.attrs as any).surveyEndTime = toISOTimezoneString(
                        new Date(e.detail.value)
                      );
                    }}
                    value={(sample.attrs as any).surveyEndTime}
                  />
                </IonModal>
              </div>
            </div>
          </IonItem>

          <MenuAttrItemFromModel
            model={sample}
            attr="comment"
            skipValueTranslation
          />
        </div>
      </IonList>

      {!isDisabled && (
        <Button
          color="secondary"
          prefix={<IonIcon src={cameraOutline} className="size-5" />}
          onPress={photoSelect}
          className="mx-auto mb-5 mt-10"
        >
          Add
        </Button>
      )}

      <SpeciesList sample={sample} isDisabled={isDisabled} useDoughnut />
    </Main>
  );
};

export default observer(HomeMain);
