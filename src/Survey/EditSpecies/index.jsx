import React from 'react';
import PropTypes from 'prop-types';
import { Page, Header } from '@apps';
import Main from './Main';

function EditSpecies({ subSample }) {
  return (
    <Page id="species-profile">
      <Header title="Species" />
      <Main sample={subSample} />
    </Page>
  );
}

EditSpecies.propTypes = {
  subSample: PropTypes.object.isRequired,
};

export default EditSpecies;
