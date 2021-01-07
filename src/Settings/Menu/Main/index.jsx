import React from 'react';
import { observer } from 'mobx-react';
import { Main, alert, Toggle, MenuNote } from '@apps';
import PropTypes from 'prop-types';
import { IonIcon, IonList, IonItem, IonLabel } from '@ionic/react';
import { arrowUndoSharp, shareSocialOutline } from 'ionicons/icons';
import transectIcon from 'common/images/transectIconBlack.svg';
import './styles.scss';

function resetDialog(resetApp) {
  alert({
    header: 'Reset',
    skipTranslation: true,
    message: (
      <>
        Are you sure you want to reset the application to its initial state?
        <p>
          <b>This will wipe all the locally stored app data!</b>
        </p>
      </>
    ),
    buttons: [
      { text: 'Cancel', role: 'cancel', cssClass: 'secondary' },
      {
        text: 'Reset',
        cssClass: 'secondary',
        handler: resetApp,
      },
    ],
  });
}

@observer
class Component extends React.Component {
  static propTypes = {
    resetApp: PropTypes.func.isRequired,
    onToggle: PropTypes.func.isRequired,
    sendAnalytics: PropTypes.bool,
    use10stepsForCommonStandard: PropTypes.bool,
  };

  render() {
    const {
      resetApp,
      use10stepsForCommonStandard,
      sendAnalytics,
      onToggle,
    } = this.props;

    const showAlertDialog = () => resetDialog(resetApp);

    const onSendAnalyticsToggle = checked => onToggle('sendAnalytics', checked);
    const onCommonStandardToggle = checked =>
      onToggle('use10stepsForCommonStandard', checked);

    return (
      <Main className="app-settings">
        <IonList lines="full">
          <IonItem>
            <IonIcon icon={transectIcon} size="small" slot="start" />
            <IonLabel>Shorter Common Standards</IonLabel>
            <Toggle
              onToggle={onCommonStandardToggle}
              checked={use10stepsForCommonStandard}
            />
          </IonItem>
          <MenuNote>Use 10 steps when doing Common Standards survey.</MenuNote>

          <IonItem>
            <IonIcon icon={shareSocialOutline} size="small" slot="start" />
            <IonLabel>Share App Analytics</IonLabel>
            <Toggle onToggle={onSendAnalyticsToggle} checked={sendAnalytics} />
          </IonItem>
          <MenuNote>
            Share app crash data so we can make the app more reliable.
          </MenuNote>

          <IonItem id="app-reset-btn" onClick={showAlertDialog}>
            <IonIcon icon={arrowUndoSharp} size="small" slot="start" />
            Reset App
          </IonItem>
        </IonList>
      </Main>
    );
  }
}

export default Component;
