import { FC, useState } from 'react';
import { observer } from 'mobx-react';
import { Gallery } from '@flumens';
import {
  IonItemSliding,
  IonItem,
  IonItemOptions,
  IonItemOption,
  IonLabel,
  IonSpinner,
  IonIcon,
  IonButton,
} from '@ionic/react';
import flowerIcon from 'common/images/flowerIcon.svg';
import Occurrence from 'models/occurrence';
import Sample from 'models/sample';
import './styles.scss';

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

const UnidentifiedSpeciesEntry: FC<Props> = ({
  model,
  isDisabled,
  deEmphasisedIdentifyBtn,
  onIdentify,
  onDelete,
  onClick,
  disableAI = false,
}) => {
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
      <div className="species-profile-photo">
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
      </div>
    );
  };

  const photo = hasSpeciesPhoto ? (
    <img src={hasSpeciesPhoto.getURL()} onClick={showGallery} />
  ) : (
    <IonIcon icon={flowerIcon} />
  );
  const profilePhoto = <div className="species-photo-profile">{photo}</div>;

  const deleteWrap = () => onDelete && onDelete(model);
  const onClickWrap = () => !identifying && onClick(model);

  const onIdentifyWrap = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    return onIdentify(model);
  };

  const buttonStyles = deEmphasisedIdentifyBtn ? 'outline' : 'solid';

  return (
    <IonItemSliding
      className="species-list-item unknown"
      disabled={identifying}
    >
      <IonItem detail={false} onClick={onClickWrap}>
        {profilePhoto}

        {!identifying && (
          <IonLabel text-wrap>
            <IonLabel
              className="long unknown-species-label"
              slot="start"
              color="warning"
            >
              <b>Unknown species</b>
            </IonLabel>

            {!hasSpeciesPhoto && (
              <IonLabel className="warning-message">
                Please add a photo
              </IonLabel>
            )}
          </IonLabel>
        )}

        {!disableAI && hasSpeciesPhoto && !identifying && canBeIdentified && (
          <IonButton
            slot="end"
            className="occurrence-identify"
            color="secondary"
            onClick={onIdentifyWrap}
            fill={buttonStyles}
          >
            Identify
          </IonButton>
        )}

        {identifying && (
          <>
            <IonLabel slot="end">Identifying...</IonLabel>
            <IonSpinner slot="end" className="identifying" />
          </>
        )}
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
