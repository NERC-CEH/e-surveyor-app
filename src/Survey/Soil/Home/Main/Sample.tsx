import { leaf } from 'ionicons/icons';
import { useRouteMatch } from 'react-router-dom';
import {
  IonItemSliding,
  IonItem,
  IonItemOptions,
  IonItemOption,
  useIonActionSheet,
  IonIcon,
} from '@ionic/react';
import { useAlert, useContextMenu } from 'common/flumens';
import Sample from 'models/sample';

const useDeleteAlert = (onDelete: any) => {
  const alert = useAlert();

  return () =>
    alert({
      header: 'Delete',
      skipTranslation: true,
      message: 'Are you sure you want to remove this sample from your survey?',
      buttons: [
        { text: 'Cancel', role: 'cancel', cssClass: 'primary' },
        { text: 'Delete', cssClass: 'danger', handler: onDelete },
      ],
    });
};

const useMenu = (deleteSurvey: any) => {
  const [present] = useIonActionSheet();

  const showMenu = () =>
    present({
      header: 'Actions',
      buttons: [
        { text: 'Delete', role: 'destructive', handler: deleteSurvey },
        { text: 'Cancel', role: 'cancel' },
      ],
    });

  return showMenu;
};

type Props = { sample: Sample; onDelete: any };

const SampleEntry = ({ sample, onDelete }: Props) => {
  const match = useRouteMatch();

  const onSampleDeleteWrap = () => onDelete(sample);
  const showDeleteAlert = useDeleteAlert(onSampleDeleteWrap);
  const showMenu = useMenu(showDeleteAlert);
  const { contextMenuProps } = useContextMenu({ onShow: showMenu });

  const isDisabled = sample.isUploaded();

  const getSamplePhoto = (smp: Sample) => {
    const pic = smp.media[0]?.getURL();

    const photo = pic ? <img src={pic} /> : <IonIcon icon={leaf} />;

    return <div className="list-avatar">{photo}</div>;
  };

  return (
    <IonItemSliding {...contextMenuProps}>
      <IonItem
        routerLink={`${match.url}/sample/${sample.cid}`}
        detail
        className="[--padding-start:1px]"
      >
        <div className="flex items-center gap-2">
          {getSamplePhoto(sample)}
          <h3>{sample.getPrettyName()}</h3>
        </div>
      </IonItem>

      {!isDisabled && (
        <IonItemOptions side="end">
          <IonItemOption color="danger" onClick={showDeleteAlert}>
            Delete
          </IonItemOption>
        </IonItemOptions>
      )}
    </IonItemSliding>
  );
};

export default SampleEntry;
