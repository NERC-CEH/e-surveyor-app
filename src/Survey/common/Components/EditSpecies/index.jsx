import React from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { Page, Header } from '@flumens';
import Main from './Main';

function EditSpecies({ subSample, subSubSample }) {
  const sample = subSubSample || subSample;

  return (
    <Page id="species-profile">
      <Header title="Species" />
      <Main sample={sample} isDisabled={subSample.isUploaded()} />
    </Page>
  );
}

EditSpecies.propTypes = {
  subSample: PropTypes.object.isRequired,
  subSubSample: PropTypes.object,
};

export default observer(EditSpecies);
