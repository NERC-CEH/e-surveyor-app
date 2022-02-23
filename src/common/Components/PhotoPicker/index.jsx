import React from 'react';
import { PhotoPicker } from '@flumens';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import Media from 'models/image';
import config from 'common/config';
import { getImage, getImageModel } from './imageUtils';
import './styles.scss';

const AppPhotoPicker = ({ model, ...restProps }) => {
  const { t } = useTranslation();

  const promptOptions = {
    promptLabelHeader: t('Choose a method to upload a photo'),
    promptLabelPhoto: t('Gallery'),
    promptLabelPicture: t('Camera'),
    promptLabelCancel: t('Cancel'),
  };

  async function getImageWrap() {
    const image = await getImage(promptOptions);

    if (!image) {
      return null;
    }

    const imageModel = await getImageModel(Media, image, config.dataPath);

    return imageModel;
  }

  return <PhotoPicker getImage={getImageWrap} model={model} {...restProps} />;
};

export default observer(AppPhotoPicker);
