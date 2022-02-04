import React, { FC } from 'react';
import { IonSpinner } from '@ionic/react';
import { observer } from 'mobx-react';
import Sample from 'models/sample';
import { prettyPrintLocation } from '@flumens';
import './styles.scss';

function getValue(sample: typeof Sample) {
  if (sample.isGPSRunning()) {
    return <IonSpinner />;
  }

  let value;
  try {
    value = prettyPrintLocation(sample.attrs.location);
  } catch (error) {
    value = `${sample.attrs.location.latitude.toFixed(
      3
    )} ${sample.attrs.location.longitude.toFixed(3)}`;
  }
  return value;
}

interface Props {
  sample: typeof Sample;
}

const GridRefValue: FC<Props> = ({ sample }) => {
  const value = getValue(sample);

  return <div className="gridref-label">{value}</div>;
};

export default observer(GridRefValue);
