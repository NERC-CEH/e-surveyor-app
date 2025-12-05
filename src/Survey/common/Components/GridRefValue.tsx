import { observer } from 'mobx-react';
import { prettyPrintLocation } from '@flumens';
import { IonSpinner } from '@ionic/react';
import Sample from 'models/sample';

function getValue(sample: Sample) {
  if (sample.isGPSRunning()) {
    return <IonSpinner className="w-[15px]" />;
  }

  return prettyPrintLocation(sample.data.location);
}

interface Props {
  sample: Sample;
}

const GridRefValue = ({ sample }: Props) => {
  const value = getValue(sample);

  return <div className="gridref-label">{value}</div>;
};

export default observer(GridRefValue);
