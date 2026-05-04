import clsx from 'clsx';
import { calendarOutline } from 'ionicons/icons';
import {
  IonDatetime,
  IonDatetimeButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonModal,
} from '@ionic/react';

type Props = { value?: any; onChange: any; isDisabled?: boolean };

const MenuDateAttr = ({ value, onChange, isDisabled }: Props) => (
  <IonItem className="m-0! rounded-none! [--border-radius:0]! [--border-style:solid]! [--inner-padding-end:8px]!">
    <IonIcon src={calendarOutline} slot="start" />
    <IonLabel className="!opacity-100">Date</IonLabel>
    <div className="flex items-center gap-1">
      <div>
        <div className={clsx(!value && 'bg-(--form-value-color)/5 rounded-md')}>
          <IonDatetimeButton
            datetime="surveyEndTime"
            slot="end"
            className={clsx(
              '[--ion-text-color:var(--form-value-color)]',
              !value && '[&::part(native)]:opacity-0'
            )}
            onClick={() => {
              if (!value)
                onChange({ detail: { value: new Date().toISOString() } });
            }}
          />
        </div>
        <IonModal keepContentsMounted className="[--border-radius:10px]">
          <IonDatetime
            id="surveyEndTime"
            presentation="date"
            preferWheel
            onIonChange={onChange}
            value={null}
            disabled={isDisabled}
            max={new Date().toISOString()}
          />
        </IonModal>
      </div>
    </div>
  </IonItem>
);

export default MenuDateAttr;
