import React from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { Page, Header } from '@apps';
import Main from './Main';

function EditSpecies({ subSample, match }) {
  return (
    <Page id="species-profile">
      <Header title="Species" />
      <Main sample={subSample} match={match} />
    </Page>
  );
}

EditSpecies.propTypes = {
  subSample: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default observer(EditSpecies);
