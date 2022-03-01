import React, { FC } from 'react';
import { useAlert, useToast } from '@flumens';
import Sample from 'models/sample';
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
import OnlineStatus from './components/OnlineStatus';
import './styles.scss';

function deleteSurvey(alert: (options: any) => void, sample: typeof Sample) {
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

type Props = {
  sample: typeof Sample;
  uploadIsPrimary?: boolean;
};

const Survey: FC<Props> = ({ sample, uploadIsPrimary }) => {
  const alert = useAlert();
  const toast = useToast();

  const survey = sample.getSurvey();

  let href;
  if (!sample.remote.synchronising) {
    href = `/survey/${survey.name}/${sample.cid}`;
    if (survey.name === 'transect' && !sample.metadata.completedDetails) {
      href += '/details';
    }
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

  const onUpload = () => sample.upload(alert, toast);

  const deleteSurveyWrap = () => deleteSurvey(alert, sample);

  return (
    <IonItemSliding className="survey-list-item">
      <IonItem routerLink={href} detail>
        <IonIcon icon={survey.icon} color="primary" />
        <IonLabel>{getSampleInfo()}</IonLabel>
        <OnlineStatus
          sample={sample}
          onUpload={onUpload}
          uploadIsPrimary={!!uploadIsPrimary}
        />
      </IonItem>

      <IonItemOptions side="end">
        <IonItemOption color="danger" onClick={deleteSurveyWrap}>
          Delete
        </IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
  );
};

export default observer(Survey);
