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
import { Button, Gallery, useAlert, useContextMenu } from '@flumens';
import {
  IonItemSliding,
  IonItem,
  IonItemOptions,
  IonItemOption,
  IonIcon,
  useIonActionSheet,
} from '@ionic/react';
import config from 'common/config';
import Occurrence from 'models/occurrence';
import Sample from 'models/sample';

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

type Props = {
  model: Sample | Occurrence;
  isDisabled: boolean;
  onReidentify?: any;
  useDoughnut?: boolean;
  onDelete?: () => void;
  onClick: (model: Sample | Occurrence) => void;
};

const Species = ({
  model,
  isDisabled,
  onDelete,
  onClick,
  useDoughnut,
  onReidentify,
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
    speciesPhoto = photo.attrs ? photo.getURL() : null;
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

  if (species) {
    scientificName = species.scientificName;
    commonName = species.commonName;
    notFoundInUK = !species.warehouseId;

    const earthIcon = notFoundInUK ? earth : checkmarkCircle;

    if (species.score > POSITIVE_THRESHOLD) {
      idClass = '[--detail-icon-color:var(--id-positive-color)]';
      detailIcon = earthIcon;
    } else if (species.score > POSSIBLE_THRESHOLD) {
      idClass = '[--detail-icon-color:var(--id-possible-color)]';
      detailIcon = helpCircle;
    } else {
      idClass = '[--detail-icon-color:var(--id-rejected-color)]';
      detailIcon = closeCircle;
    }

    const speciesDoesNotExist = species.score === 0;

    if (speciesDoesNotExist) {
      scientificName = 'Not found';
      idClass = 'id-red';
      detailIcon = closeCircle;
    }
  }

  const onClickWrap = () => onClick(model);

  const detailsIcon = detailIcon || '';

  const photo = speciesPhoto ? (
    <img
      src={speciesPhoto}
      onClick={showGallery}
      className="h-full w-full object-cover"
    />
  ) : (
    <IonIcon icon={leaf} />
  );
  const profilePhoto = <div className="list-avatar">{photo}</div>;

  const getSpeciesName = () => {
    return (
      <div className="flex flex-col">
        {commonName && <div className="font-semibold">{commonName}</div>}
        <div className="italic">{scientificName}</div>
      </div>
    );
  };

  const showReidentify = onReidentify && species.score <= 0.1;
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
          <div className="flex items-center gap-3 ">
            {profilePhoto}

            {getSpeciesName()}
          </div>

          {useDoughnut && !showReidentify && (
            <div className="p-[5px]; relative h-[40px] w-[40px] shrink-0 self-center">
              <Doughnut
                data={getDoughnutData(species.score)}
                options={options}
                redraw
              />
              <div className="surveyEndTime absolute left-0 top-0 flex h-full w-full items-center justify-center text-[0.7em]">
                {getDoughnutData(species.score).text}
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
