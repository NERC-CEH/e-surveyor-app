import { observer } from 'mobx-react';
import { prettyPrintLocation } from '@flumens';
import { IonSpinner } from '@ionic/react';
import { hasCoordinates } from 'common/helpers/location';
import Sample from 'models/sample';

function getValue(sample: Sample) {
  if (sample.isGPSRunning()) {
    return <IonSpinner className="w-[15px]" />;
  }

  return hasCoordinates(sample.data.location)
    ? prettyPrintLocation(sample.data.location)
    : null;
}

type Props = {
  sample: Sample;
};

const GridRefValue = ({ sample }: Props) => {
  const value = getValue(sample);

  return <div className="gridref-label">{value}</div>;
};

export default observer(GridRefValue);
