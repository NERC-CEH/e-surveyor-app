import { useState } from 'react';
import { observer } from 'mobx-react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Gallery, useAlert, useContextMenu } from '@flumens';
import {
  IonItemSliding,
  IonItem,
  IonItemOptions,
  IonItemOption,
  IonSpinner,
  IonIcon,
  useIonActionSheet,
  isPlatform,
} from '@ionic/react';
import flowerIcon from 'common/images/flowerIcon.svg';
import Occurrence from 'models/occurrence';
import Sample from 'models/sample';

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

type Model = Sample | Occurrence;

interface Props {
  model: Model;
  isDisabled: boolean;
  onIdentify: (model: Model) => void;
  onDelete?: () => void;
  onClick: (model: Model) => void;
  disableAI?: boolean;
}

const UnidentifiedSpeciesEntry = ({
  model,
  isDisabled,
  onIdentify,
  onDelete,
  onClick,
  disableAI = false,
}: Props) => {
  const showDeleteAlert = useDeleteAlert(onDelete);
  const showMenu = useMenu(showDeleteAlert);
  const { contextMenuProps } = useContextMenu({ onShow: showMenu });

  const occ = model instanceof Occurrence ? model : model.occurrences[0];
  const [hasSpeciesPhoto] = occ.media;

  const identifying = occ.isIdentifying();

  const canBeIdentified = !occ.getSpecies() && occ.canReIdentify();

  const [showingGallery, setShowGallery] = useState(false);
  const showGallery = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setShowGallery(true);
  };
  const hideGallery = () => setShowGallery(false);

  const getGallery = () => {
    if (!hasSpeciesPhoto) return null;

    return (
      <Gallery
        isOpen={showingGallery}
        items={[
          {
            src: hasSpeciesPhoto.getURL(),
          },
        ]}
        initialSlide={0}
        onClose={hideGallery}
      />
    );
  };

  const photo = hasSpeciesPhoto ? (
    <img src={hasSpeciesPhoto.getURL()} onClick={showGallery} />
  ) : (
    <IonIcon icon={flowerIcon} />
  );
  const profilePhoto = <div className="list-avatar">{photo}</div>;

  const onClickWrap = () => !identifying && onClick(model);

  const onIdentifyWrap = () => onIdentify(model);

  return (
    <IonItemSliding disabled={identifying}>
      <IonItem
        detail={false}
        onClick={onClickWrap}
        className="[--inner-padding-end:0px] [--padding-start:0px]"
        {...contextMenuProps}
      >
        <div className="flex w-full items-center gap-2 bg-warning-100/50 p-1">
          {profilePhoto}

          <div className="flex w-full justify-between">
            <div>
              <div className="font-semibold text-warning-900">Unidentified</div>

              {!hasSpeciesPhoto && (
                <div className="text-warning-900">Please add a photo</div>
              )}
            </div>

            {!disableAI &&
              !identifying &&
              hasSpeciesPhoto &&
              canBeIdentified && (
                <button
                  className="occurrence-identify flex h-fit items-center justify-center gap-4 overflow-hidden rounded-md border border-solid border-secondary-800 bg-transparent px-6 py-1 text-center text-xs text-secondary-800 shadow-sm outline-none ring-0 transition hover:border-neutral-400"
                  onClick={(e: any) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onIdentifyWrap();
                  }}
                >
                  Identify
                </button>
              )}

            {identifying && <IonSpinner className="mr-2 size-5" />}
          </div>
        </div>
      </IonItem>

      {!isDisabled && onDelete && (
        <IonItemOptions side="end">
          <IonItemOption color="danger" onClick={showDeleteAlert}>
            Delete
          </IonItemOption>
        </IonItemOptions>
      )}

      {getGallery()}
    </IonItemSliding>
  );
};

export default observer(UnidentifiedSpeciesEntry);
