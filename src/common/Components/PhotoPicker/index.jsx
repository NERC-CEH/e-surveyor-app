import React from 'react';
import { PhotoPicker } from '@flumens';
import { useTranslation } from 'react-i18next';
import { IonIcon, IonButton, IonSpinner } from '@ionic/react';
import { observer } from 'mobx-react';
import { warningOutline, close } from 'ionicons/icons';
import Media from 'models/image';
import config from 'common/config';
import utils from './imageUtils';
import './styles.scss';

const ImageWrap = ({ media, isDisabled, onDelete, onClick }) => {
  const showWarning = !media.doesTaxonMatchParent(); // calculate from media.parent

  const showLoading = media.identification.identifying;

  return (
    <div className="img">
      {!isDisabled && (
        <IonButton fill="clear" class="delete" onClick={onDelete}>
          <IonIcon icon={close} />
        </IonButton>
      )}
      <img src={media.attrs.thumbnail} onClick={onClick} />

      {showLoading && <IonSpinner slot="end" className="identifying" />}
      {!showLoading && showWarning && (
        <IonIcon className="warning-icon" icon={warningOutline} />
      )}
    </div>
  );
};
const Image = observer(ImageWrap);

const AppPhotoPicker = ({ model }) => {
  const { t } = useTranslation();

  const promptOptions = {
    promptLabelHeader: t('Choose a method to upload a photo'),
    promptLabelPhoto: t('Gallery'),
    promptLabelPicture: t('Camera'),
    promptLabelCancel: t('Cancel'),
  };

  async function getImage() {
    const image = await utils.getImage(promptOptions);

    if (!image) {
      return null;
    }

    const imageModel = await utils.getImageModel(Media, image, config.dataPath);

    const isMothSurvey = model?.parent.metadata.survey === 'moth';
    if (isMothSurvey) imageModel.identify();

    return imageModel;
  }

  return <PhotoPicker getImage={getImage} model={model} Image={Image} />;
};

export default observer(AppPhotoPicker);
