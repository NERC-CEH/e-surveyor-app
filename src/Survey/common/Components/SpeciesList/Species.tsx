/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useState } from 'react';
import { observer } from 'mobx-react';
import clsx from 'clsx';
import {
  checkmarkCircle,
  helpCircle,
  closeCircle,
  earth,
  imageOutline,
} from 'ionicons/icons';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Button, Gallery, useAlert, useContextMenu } from '@flumens';
import {
  IonItemSliding,
  IonItem,
  IonItemOptions,
  IonItemOption,
  IonIcon,
  useIonActionSheet,
  isPlatform,
} from '@ionic/react';
import Doughnut from 'common/Components/Doughnut';
import config from 'common/config';
import Occurrence from 'models/occurrence';
import IncrementalButton from 'Survey/common/Components/IncrementalButton';
import { occurrenceAbundanceAttr } from 'Survey/common/config';

const { positiveThreshold, possibleThreshold } = config;

const useDeleteAlert = (onDelete: any) => {
  const alert = useAlert();

  return () => {
    alert({
      header: 'Delete',
      skipTranslation: true,
      message: 'Are you sure you want to remove it from your device?',
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Delete',
          role: 'destructive',
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
  occurrence: Occurrence;
  isDisabled: boolean;
  onReidentify?: any;
  useDoughnut?: boolean;
  showGallery?: boolean;
  showPhoto?: boolean;
  onDelete?: () => void;
  onClick: (model: Occurrence) => void;
  itemNumber?: number;
};

const Species = ({
  occurrence,
  isDisabled,
  onDelete,
  onClick,
  useDoughnut,
  showPhoto,
  showGallery = true,
  onReidentify,
  itemNumber,
}: Props) => {
  const showDeleteAlert = useDeleteAlert(onDelete);
  const showMenu = useMenu(showDeleteAlert);
  const { contextMenuProps } = useContextMenu({ onShow: showMenu });

  const species = occurrence.getSpecies();

  let commonName: string;
  let scientificName: string;
  let idClass;
  let detailIcon;
  let notFoundInUK;
  let speciesPhoto: any;

  const { media } = occurrence;
  if (media.length) {
    const photo = media[0];
    speciesPhoto = photo.data ? photo.getURL() : null;
  }

  const [isShowingGallery, setIsShowingGallery] = useState(false);
  const onPhotoPress = (e: any) => {
    if (!showGallery) return;
    e.preventDefault();
    e.stopPropagation();
    setIsShowingGallery(true);
  };
  const hideGallery = () => setIsShowingGallery(false);

  const getGallery = () => {
    if (!speciesPhoto) return null;

    return (
      <Gallery
        isOpen={isShowingGallery}
        items={[{ src: speciesPhoto }]}
        initialSlide={0}
        onClose={hideGallery}
      />
    );
  };

  const probability = species.probability || (species as any).score || 0; // score for backward compatibility

  if (species) {
    scientificName = species.scientificName;
    commonName = species.commonName;
    notFoundInUK = !species.warehouseId;

    const earthIcon = notFoundInUK ? earth : checkmarkCircle;

    if (probability > positiveThreshold) {
      idClass = '[--detail-icon-color:var(--id-positive-color)]';
      detailIcon = earthIcon;
    } else if (probability > possibleThreshold) {
      idClass = '[--detail-icon-color:var(--id-possible-color)]';
      detailIcon = helpCircle;
    } else {
      idClass = '[--detail-icon-color:var(--id-rejected-color)]';
      detailIcon = closeCircle;
    }

    const speciesDoesNotExist = probability === 0;

    if (speciesDoesNotExist) {
      scientificName = 'Not found';
      idClass = 'id-red';
      detailIcon = closeCircle;
    }
  }

  const onClickWrap = () => onClick(occurrence);

  const detailsIcon = detailIcon || '';

  // increment abundance for beetle occurrences
  const incrementAbundance = () => {
    const currentAbundance = occurrence.data[occurrenceAbundanceAttr.id] || 1;
    occurrence.data[occurrenceAbundanceAttr.id] = currentAbundance + 1;
    occurrence.save();
  };

  const useIncrementalButton = itemNumber === undefined;

  const getIncrementalButton = () => {
    // show incremental button if itemNumber is provided
    if (useIncrementalButton) return null;

    const abundance = occurrence.data[occurrenceAbundanceAttr.id] || 1;

    return (
      <div className="list-avatar">
        <IncrementalButton
          value={abundance}
          onClick={incrementAbundance}
          disabled={isDisabled}
        />
      </div>
    );
  };

  const getPhoto = () => {
    if (useIncrementalButton && !showPhoto) return null;

    if (speciesPhoto)
      return (
        <div className="list-avatar">
          <img
            src={speciesPhoto}
            onClick={onPhotoPress}
            className="h-full w-full object-cover"
          />
        </div>
      );

    return (
      <div className="list-avatar">
        <IonIcon icon={imageOutline} />
      </div>
    );
  };

  const getSpeciesName = () => (
    <div className="flex flex-col">
      {commonName && (
        <div className="font-semibold line-clamp-1">{commonName}</div>
      )}
      <div className="italic line-clamp-1">{scientificName}</div>
    </div>
  );

  const showReidentify = onReidentify && probability <= 0.1;
  const onReidentifyWrap = () => onReidentify(occurrence);

  return (
    <IonItemSliding key={occurrence.cid} {...contextMenuProps}>
      <IonItem
        detail={!useDoughnut && !showReidentify}
        detailIcon={detailsIcon}
        className={clsx(
          `[--detail-icon-opacity:1] ps-ion-0 ${idClass}`,
          useDoughnut && 'pe-ion-i-0'
        )}
        onClick={onClickWrap}
      >
        <div className="flex w-full items-center justify-between gap-2 p-1">
          <div className="flex items-center gap-3">
            {getIncrementalButton()}
            {getPhoto()}
            {getSpeciesName()}
          </div>

          {useDoughnut && !showReidentify && (
            <Doughnut probability={probability} />
          )}

          {showReidentify && (
            <Button
              onPress={onReidentifyWrap}
              preventDefault
              className="px-2 py-1 text-sm shrink-0"
            >
              Reidentify
            </Button>
          )}
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

export default observer(Species);
