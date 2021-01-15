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
import flowerIcon from 'common/images/flowerIcon.svg';
import './styles.scss';

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
  const survey = sample.getSurvey();
  let href = `/survey/${survey.name}/${sample.cid}`;
  if (survey.name === 'transect' && !sample.metadata.completedDetails) {
    href += '/details';
  }

  function getSampleInfo() {
    if (survey.name === 'transect') {
      return (
        <div className="species-info">
          <h3>{survey.label}</h3>
          <h4>{sample.attrs.type}</h4>
          <h4>{sample.attrs.name}</h4>
        </div>
      );
    }

    const showSpeciesLength = sample.samples.length;

    return (
      <div className="species-info">
        <h3>
          {survey.label}

          {!!showSpeciesLength && (
            <IonBadge>
              <IonIcon icon={flowerIcon} />
              {showSpeciesLength}
            </IonBadge>
          )}
        </h3>

        <h4>{sample.attrs.name}</h4>
      </div>
    );
  }

  const deleteSurveyWrap = () => deleteSurvey(sample);

  const surveyIcon = survey.icon;

  return (
    <IonItemSliding className="survey-list-item">
      <IonItem routerLink={href} detail>
        <IonIcon icon={surveyIcon} color="primary" />
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
