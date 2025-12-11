import { useState } from 'react';
import { observer } from 'mobx-react';
import clsx from 'clsx';
import {
  checkmarkCircle,
  helpCircle,
  closeCircle,
  earth,
  leaf,
} from 'ionicons/icons';
import { Doughnut } from 'react-chartjs-2';
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
import config from 'common/config';
import Occurrence from 'models/occurrence';
import Sample from 'models/sample';
import { occurrenceAbundanceAttr } from 'Survey/Beetle/config';
import IncrementalButton from 'Survey/common/Components/IncrementalButton';

const { POSITIVE_THRESHOLD, POSSIBLE_THRESHOLD } = config;

const options = {
  cutout: '80%',
  layout: {
    padding: { top: -9 }, // for some reason the chart is moved down
  },
  tooltip: { enabled: false }, // Disable the on-canvas tooltip
  animation: { animation: false, animateRotate: false },
};

const getDoughnutData = (score: number) => {
  const scorePercent = parseInt((score * 100).toFixed(0), 10);

  const color = () => {
    if (scorePercent > POSITIVE_THRESHOLD * 100) {
      return '#4b9a43'; // green
    }

    if (scorePercent > POSSIBLE_THRESHOLD * 100) {
      return '#ffbc5e'; // yellow
    }

    return '#ff4e46'; // red
  };

  const remainingScorePercent = 100 - scorePercent;

  return {
    datasets: [
      {
        data: [scorePercent, remainingScorePercent],
        backgroundColor: [color(), '#f5f5f5'],
        borderWidth: [0, 0],
      },
    ],
    text: `${scorePercent}%`,
  };
};

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
  model: Sample | Occurrence;
  isDisabled: boolean;
  onReidentify?: any;
  useDoughnut?: boolean;
  onDelete?: () => void;
  onClick: (model: Sample | Occurrence) => void;
  itemNumber?: number;
};

const Species = ({
  model,
  isDisabled,
  onDelete,
  onClick,
  useDoughnut,
  onReidentify,
  itemNumber,
}: Props) => {
  const showDeleteAlert = useDeleteAlert(onDelete);
  const showMenu = useMenu(showDeleteAlert);
  const { contextMenuProps } = useContextMenu({ onShow: showMenu });

  const species = model.getSpecies();
  const occ = model instanceof Occurrence ? model : model.occurrences[0];

  let commonName: string;
  let scientificName: string;
  let idClass;
  let detailIcon;
  let notFoundInUK;
  let speciesPhoto: any;

  const { media } = occ;
  if (media.length) {
    const photo = media[0];
    speciesPhoto = photo.data ? photo.getURL() : null;
  }

  const [showingGallery, setShowGallery] = useState(false);
  const showGallery = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setShowGallery(true);
  };
  const hideGallery = () => setShowGallery(false);

  const getGallery = () => {
    if (!speciesPhoto) return null;

    return (
      <Gallery
        isOpen={showingGallery}
        items={[
          {
            src: speciesPhoto,
          },
        ]}
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

    if (probability > POSITIVE_THRESHOLD) {
      idClass = '[--detail-icon-color:var(--id-positive-color)]';
      detailIcon = earthIcon;
    } else if (probability > POSSIBLE_THRESHOLD) {
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

  const onClickWrap = () => onClick(model);

  const detailsIcon = detailIcon || '';

  // increment abundance for beetle occurrences
  const incrementAbundance = () => {
    const currentAbundance = occ.data[occurrenceAbundanceAttr.id] || 1;
    occ.data[occurrenceAbundanceAttr.id] = currentAbundance + 1;
    occ.save();
  };

  const getProfileContent = () => {
    // show incremental button if itemNumber is provided
    if (itemNumber !== undefined) {
      const abundance = occ.data[occurrenceAbundanceAttr.id] || 1;

      return (
        <IncrementalButton
          value={abundance}
          onClick={incrementAbundance}
          disabled={isDisabled}
        />
      );
    }

    // show photo or leaf icon
    if (speciesPhoto)
      return (
        <img
          src={speciesPhoto}
          onClick={showGallery}
          className="h-full w-full object-cover"
        />
      );

    return <IonIcon icon={leaf} />;
  };

  const profilePhoto = <div className="list-avatar">{getProfileContent()}</div>;

  const getSpeciesName = () => {
    return (
      <div className="flex flex-col">
        {commonName && <div className="font-semibold">{commonName}</div>}
        <div className="italic">{scientificName}</div>
      </div>
    );
  };

  const showReidentify = onReidentify && probability <= 0.1;
  const onReidentifyWrap = () => onReidentify(model);

  return (
    <IonItemSliding key={model.cid} {...contextMenuProps}>
      <IonItem
        detail={!useDoughnut && !showReidentify}
        detailIcon={detailsIcon}
        className={clsx(
          `[--detail-icon-opacity:1] [--padding-start:0px] ${idClass}`,
          useDoughnut && '[--inner-padding-end:0]'
        )}
        onClick={onClickWrap}
      >
        <div className="flex w-full items-center justify-between gap-2 p-1">
          <div className="flex items-center gap-3">
            {profilePhoto}

            {getSpeciesName()}
          </div>

          {useDoughnut && !showReidentify && (
            <div className="p-[5px]; relative h-[40px] w-[40px] shrink-0 self-center">
              <Doughnut
                data={getDoughnutData(probability)}
                options={options}
                redraw
              />
              <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center text-[0.7em]">
                {getDoughnutData(probability).text}
              </div>
            </div>
          )}

          {showReidentify && (
            <Button
              onPress={onReidentifyWrap}
              preventDefault
              className="px-2 py-1 text-sm"
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
