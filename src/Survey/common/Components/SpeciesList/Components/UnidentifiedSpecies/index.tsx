import React, { FC } from 'react';
import Sample from 'models/sample';
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
import { observer } from 'mobx-react';
import flowerIcon from 'common/images/flowerIcon.svg';

import './styles.scss';

interface Props {
  sample: Sample;
  isDisabled: boolean;
  deEmphasisedIdentifyBtn: boolean;
  onIdentify: (smp: Sample) => void;
  onDelete: (smp: Sample) => void;
  onClick: (smp: Sample) => void;
}

const UnidentifiedSpeciesEntry: FC<Props> = ({
  sample,
  isDisabled,
  deEmphasisedIdentifyBtn,
  onIdentify,
  onDelete,
  onClick,
}) => {
  const [occ] = sample.occurrences;
  const [hasSpeciesPhoto] = occ.media;

  const identifying = occ.isIdentifying();

  const canBeIdentified = !occ.getSpecies() && occ.canReIdentify();

  const photo = hasSpeciesPhoto ? (
    <img src={hasSpeciesPhoto.getURL()} />
  ) : (
    <IonIcon icon={flowerIcon} />
  );
  const profilePhoto = <div className="plant-photo-profile">{photo}</div>;

  const deleteWrap = () => onDelete(sample);
  const onClickWrap = () => !identifying && onClick(sample);

  const onIdentifyWrap = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    return onIdentify(sample);
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

        {hasSpeciesPhoto && !identifying && canBeIdentified && (
          <IonButton
            slot="end"
            class="occurrence-identify"
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

      {!isDisabled && (
        <IonItemOptions side="end">
          <IonItemOption color="danger" onClick={deleteWrap}>
            Delete
          </IonItemOption>
        </IonItemOptions>
      )}
    </IonItemSliding>
  );
};

export default observer(UnidentifiedSpeciesEntry);
