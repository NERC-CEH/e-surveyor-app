import { observer } from 'mobx-react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import {
  useAlert,
  useToast,
  Badge,
  getRelativeDate,
  useContextMenu,
} from '@flumens';
import {
  IonItem,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonLabel,
  IonIcon,
  useIonActionSheet,
  isPlatform,
} from '@ionic/react';
import flowerIcon from 'common/images/flowerIcon.svg';
import Sample, { useValidateCheck } from 'models/sample';
import { useUserStatusCheck } from 'models/user';
import OnlineStatus from './OnlineStatus';
import './styles.scss';

const useDeleteAlert = (onDelete: any) => {
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
          handler: onDelete,
        },
      ],
    });
  };
};

const useMenu = (deleteSurvey: any) => {
  const [present] = useIonActionSheet();

  const showMenu = () => {
    isPlatform('hybrid') && Haptics.impact({ style: ImpactStyle.Light });

    present({
      header: 'Actions',
      buttons: [
        { text: 'Delete', role: 'destructive', handler: deleteSurvey },
        { text: 'Cancel', role: 'cancel' },
      ],
    });
  };

  return showMenu;
};

type Props = {
  sample: Sample;
  onDelete: () => void;
  uploadIsPrimary?: boolean;
};

const Survey = ({ sample, uploadIsPrimary, onDelete }: Props) => {
  const showDeleteAlert = useDeleteAlert(onDelete);
  const showMenu = useMenu(showDeleteAlert);
  const { contextMenuProps } = useContextMenu({ onShow: showMenu });

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

    if (
      survey.name === 'beetle' ||
      survey.name === 'moth' ||
      survey.name === 'soil'
    ) {
      return (
        <div className="species-info">
          <h3>{survey.label}</h3>
          <h4>{getRelativeDate(sample.attrs.date)}</h4>
        </div>
      );
    }

    const showSpeciesLength = sample.samples.length;

    return (
      <div className="species-info">
        <h3>{survey.label}</h3>
        {!!showSpeciesLength && (
          <Badge
            skipTranslation
            className="py-[3px] text-sm"
            prefix={<IonIcon icon={flowerIcon} />}
          >
            {showSpeciesLength}
          </Badge>
        )}
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
    <IonItemSliding className="survey-list-item" {...contextMenuProps}>
      <IonItem routerLink={href} detail={false}>
        <div className="list-avatar">
          <IonIcon icon={survey.icon} className="bg-primary-50/80 text-3xl" />
        </div>
        <IonLabel>{getSampleInfo()}</IonLabel>
        <OnlineStatus
          sample={sample}
          onUpload={onUpload}
          uploadIsPrimary={!!uploadIsPrimary}
        />
      </IonItem>

      <IonItemOptions side="end">
        <IonItemOption color="danger" onClick={showDeleteAlert}>
          Delete
        </IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
  );
};

export default observer(Survey);
