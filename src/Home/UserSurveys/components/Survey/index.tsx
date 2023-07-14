import { FC } from 'react';
import { observer } from 'mobx-react';
import { useAlert, useToast, date } from '@flumens';
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
import Sample, { useValidateCheck } from 'models/sample';
import { useUserStatusCheck } from 'models/user';
import OnlineStatus from './components/OnlineStatus';
import './styles.scss';

const useDeleteAlert = (sample: Sample) => {
  const alert = useAlert();

  return () => {
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
  };
};

type Props = {
  sample: Sample;
  uploadIsPrimary?: boolean;
};

const Survey: FC<Props> = ({ sample, uploadIsPrimary }) => {
  const deleteSurvey = useDeleteAlert(sample);
  const toast = useToast();
  const checkUserStatus = useUserStatusCheck();
  const checkSampleStatus = useValidateCheck(sample);

  const survey = sample.getSurvey();

  let href;
  if (!sample.remote.synchronising) {
    href = `/survey/${survey.name}/${sample.cid}`;
    if (!sample.isDetailsComplete()) {
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

    if (survey.name === 'beetle') {
      return (
        <div className="species-info">
          <h3>{survey.label}</h3>
          <h4>{date.print(sample.attrs.date, true)}</h4>
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

  const onUpload = async () => {
    const isUserOK = await checkUserStatus();
    if (!isUserOK) return;

    const isValid = checkSampleStatus();
    if (!isValid) return;

    sample.upload().catch(toast.error);
  };

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
        <IonItemOption color="danger" onClick={deleteSurvey}>
          Delete
        </IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
  );
};

export default observer(Survey);
