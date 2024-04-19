import { useState } from 'react';
import { observer } from 'mobx-react';
import { Button, Gallery } from '@flumens';
import {
  IonItemSliding,
  IonItem,
  IonItemOptions,
  IonItemOption,
  IonSpinner,
  IonIcon,
} from '@ionic/react';
import flowerIcon from 'common/images/flowerIcon.svg';
import Occurrence from 'models/occurrence';
import Sample from 'models/sample';

type Model = Sample | Occurrence;

interface Props {
  model: Model;
  isDisabled: boolean;
  deEmphasisedIdentifyBtn: boolean;
  onIdentify: (model: Model) => void;
  onDelete?: (model: Model) => void;
  onClick: (model: Model) => void;
  disableAI?: boolean;
}

const UnidentifiedSpeciesEntry = ({
  model,
  isDisabled,
  deEmphasisedIdentifyBtn,
  onIdentify,
  onDelete,
  onClick,
  disableAI = false,
}: Props) => {
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

  const deleteWrap = () => onDelete && onDelete(model);
  const onClickWrap = () => !identifying && onClick(model);

  const onIdentifyWrap = () => onIdentify(model);

  const buttonStyles = deEmphasisedIdentifyBtn ? 'outline' : 'solid';

  return (
    <IonItemSliding disabled={identifying}>
      <IonItem
        detail={false}
        onClick={onClickWrap}
        className="[--inner-padding-end:0px] [--padding-start:0px]"
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
                <Button
                  className="occurrence-identify py-1 text-xs"
                  color="secondary"
                  onPress={onIdentifyWrap}
                  fill={buttonStyles}
                  preventDefault
                >
                  Identify
                </Button>
              )}

            {identifying && <IonSpinner className="mr-2 size-5" />}
          </div>
        </div>
      </IonItem>

      {!isDisabled && onDelete && (
        <IonItemOptions side="end">
          <IonItemOption color="danger" onClick={deleteWrap}>
            Delete
          </IonItemOption>
        </IonItemOptions>
      )}

      {getGallery()}
    </IonItemSliding>
  );
};

export default observer(UnidentifiedSpeciesEntry);
