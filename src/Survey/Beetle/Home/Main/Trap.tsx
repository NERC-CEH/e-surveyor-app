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
      message: 'Are you sure you want to remove this trap from your survey?',
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

type Props = { sample: Sample; onTrapDelete: any };

const Trap = ({ sample: trapSample, onTrapDelete }: Props) => {
  const match = useRouteMatch();

  const onTrapDeleteWrap = () => onTrapDelete(trapSample);
  const showDeleteAlert = useDeleteAlert(onTrapDeleteWrap);
  const showMenu = useMenu(showDeleteAlert);
  const { contextMenuProps } = useContextMenu({ onShow: showMenu });

  const isDisabled = trapSample.isUploaded();

  const getTrapPhoto = (smp: Sample) => {
    const pic = smp.media[0]?.getURL();

    const photo = pic ? <img src={pic} /> : <IonIcon icon={leaf} />;

    return <div className="list-avatar">{photo}</div>;
  };

  return (
    <IonItemSliding key={trapSample.cid} {...contextMenuProps}>
      <IonItem routerLink={`${match.url}/trap/${trapSample.cid}`} detail>
        <div className="flex items-center gap-2">
          {getTrapPhoto(trapSample)}
          <h3>{trapSample.getPrettyName()}</h3>
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

export default Trap;
