import React from 'react';
import { PhotoPicker } from '@flumens';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import Media from 'models/image';
import config from 'common/config';
import utils from './imageUtils';
import './styles.scss';

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

  return <PhotoPicker getImage={getImage} model={model} />;
};

export default observer(AppPhotoPicker);
