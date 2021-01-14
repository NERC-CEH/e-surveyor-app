import React from 'react';
import PropTypes from 'prop-types';
import { Page, Header } from '@apps';
import { observer } from 'mobx-react';
import Main from './Main';

@observer
class ReportController extends React.Component {
  static propTypes = {
    sample: PropTypes.object.isRequired,
  };

  render() {
    const { sample } = this.props;

    if (!sample) {
      return null;
    }

    return (
      <Page id="transect-survey-report">
        <Header title="Report" />
        <Main sample={sample} />
      </Page>
    );
  }
}

export default ReportController;
