import React from 'react';
import PropTypes from 'prop-types';
import { Page, Header } from '@apps';
import { observer } from 'mobx-react';
import Main from './Main';

@observer
class ReportController extends React.Component {
  static propTypes = {
    appModel: PropTypes.object.isRequired,
    sample: PropTypes.object.isRequired,
  };

  render() {
    const { appModel, sample } = this.props;

    if (!sample) {
      return null;
    }

    return (
      <Page id="survey-report">
        <Header title="Report" />
        <Main
          appModel={appModel}
          sample={sample}
        />
      </Page>
    );
  }
}

export default ReportController;
