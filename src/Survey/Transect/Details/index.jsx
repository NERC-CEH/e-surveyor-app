import React from 'react';
import PropTypes from 'prop-types';
import { Page, Header, alert } from '@apps';
import { IonButton, NavContext, IonIcon } from '@ionic/react';
import { arrowForwardCircleOutline } from 'ionicons/icons';
import { verifyLocationSchema } from 'Survey/common/config';
import * as Yup from 'yup';
import { observer } from 'mobx-react';
import Main from './Main';

@observer
class Controller extends React.Component {
  static contextType = NavContext;

  static propTypes = {
    match: PropTypes.object.isRequired,
    sample: PropTypes.object.isRequired,
  };

  onDone = () => {
    const { match, sample } = this.props;
      try {
        Yup.object().shape({
          location: verifyLocationSchema,
          seedmix: Yup.mixed().required('Please select your seedmix.'),
          quadratSize: Yup.number().min(1).required('Please select your seedmix.'),
          steps: Yup.number().min(1).required('Please select your seedmix.'),
          habitat: sample.attrs.type === 'Common Standards' && Yup.mixed().required()
        }).validateSync(sample.attrs)
      } catch (attrError) {
        alert({
          header: 'Missing',
          message: 'Please fill in all the details in this page before navigating next.',
          buttons: [{
            text: 'Got it',
            role: 'cancel'
          }]
        })
        return ;
      }

      sample.metadata.completedDetails = true;
    sample.save();

    const url = match.url.replace('/details', '');
    this.context.navigate(url, 'none', 'replace');
  };

  render() {
    const { match, sample } = this.props;
    const { completedDetails } = sample.metadata;

    const doneButton = !completedDetails && (
      <IonButton onClick={this.onDone} color="secondary" fill="solid">
        Next
        <IonIcon icon={arrowForwardCircleOutline} slot="end" />
      </IonButton>
    );

    return (
      <Page id="transect-details">
        <Header title="Transect" rightSlot={doneButton} />
        <Main match={match} sample={sample} isDisabled={sample.isUploaded()} />
      </Page>
    );
  }
}

export default Controller;
