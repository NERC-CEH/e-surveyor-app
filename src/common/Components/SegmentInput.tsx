import { FC } from 'react';
import {
  IonIcon,
  IonItem,
  IonLabel,
  IonSegment,
  IonSegmentButton,
} from '@ionic/react';

type Props = {
  value: any;
  options: any;
  onChange: any;
  disabled?: boolean;
};

const SegmentInput: FC<Props> = ({
  value,
  options,
  onChange,
  disabled = false,
}) => {
  const getOption = ({ value: optionValue, icon, label }: any) => (
    <IonSegmentButton value={optionValue} key={optionValue}>
      {icon && <IonIcon icon={icon} />}
      <IonLabel>{label || optionValue}</IonLabel>
    </IonSegmentButton>
  );

  const onChangeWrap = (e: any) => onChange(e.detail.value);

  return (
    <IonItem>
      <IonSegment
        value={value}
        onIonChange={onChangeWrap}
        mode="ios"
        disabled={disabled}
      >
        {options.map(getOption)}
      </IonSegment>
      {/* 
      <InfoButton
        header="Margins"
        label={<IonIcon icon={informationCircleOutline} />}
        skipTranslation
        className="ml-4 rounded-full border-0 bg-neutral-200    text-neutral-800 [--border-width:0]"
      >
        <div>
          👷‍♂️ Work in progress. We can show more information about the margins
          option here.
        </div>
      </InfoButton> */}
    </IonItem>
  );
};

export default SegmentInput;
