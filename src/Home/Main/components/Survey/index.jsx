import React from 'react';
import PropTypes from 'prop-types';
import { alert } from '@apps';
import { observer } from 'mobx-react';
import {
  IonItem,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonBadge,
  IonLabel,
  IonIcon,
} from '@ionic/react';
import './styles.scss';
import routeIcon from 'Home/route.svg';

function deleteSurvey(sample) {
  alert({
    header: 'Delete',
    skipTranslation: true,
    message: 'Are you sure you want to remove it from your device?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'primary',
      },
      {
        text: 'Delete',
        cssClass: 'danger',
        handler: () => sample.destroy(),
      },
    ],
  });
}

const Survey = ({ sample }) => {
  const href = `/survey/${sample.cid}`;

  function getSampleInfo() {
    const showSpeciesLength = sample.samples.length;

    return (
      <div className="species-info">
        <h3>{sample.attrs.name}</h3>

        <div>
          <span>
            Species: <IonBadge>{showSpeciesLength}</IonBadge>
          </span>
        </div>
      </div>
    );
  }

  const deleteSurveyWrap = () => deleteSurvey(sample);

  return (
    <IonItemSliding className="survey-list-item">
      <IonItem routerLink={href} detail>
        <IonIcon icon={routeIcon} color="primary" />
        <IonLabel>{getSampleInfo()}</IonLabel>
      </IonItem>

      <IonItemOptions side="end">
        <IonItemOption color="danger" onClick={deleteSurveyWrap}>
          Delete
        </IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
  );
};

Survey.propTypes = {
  sample: PropTypes.object.isRequired,
};

export default observer(Survey);
