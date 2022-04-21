import React, { FC, ComponentProps } from 'react';
import { PhotoPicker, captureImage } from '@flumens';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import { useIonActionSheet } from '@ionic/react';
import Media from 'models/image';
import Sample from 'models/sample';
import Occurrence from 'models/occurrence';
import config from 'common/config';
import './styles.scss';

export function usePromptImageSource() {
  const { t } = useTranslation();
  const [presentActionSheet] = useIonActionSheet();

  return () =>
    new Promise<boolean | null>(resolve => {
      presentActionSheet({
        buttons: [
          { text: t('Gallery'), handler: () => resolve(false) },
          { text: t('Camera'), handler: () => resolve(true) },
          { text: t('Cancel'), role: 'cancel', handler: () => resolve(null) },
        ],
        header: 'Choose a method to upload a photo',
      });
    });
}

interface Props extends Omit<ComponentProps<typeof PhotoPicker>, 'getImage'> {
  model: Sample | Occurrence;
  maxImages?: number;
}

const AppPhotoPicker: FC<Props> = ({ model, maxImages, ...restProps }) => {
  const promptImageSource = usePromptImageSource();

  async function getImageWrap() {
    if (
      Number.isFinite(maxImages) &&
      model.media.length >= (maxImages as number)
    )
      return null;

    const shouldUseCamera = await promptImageSource();
    const cancelled = shouldUseCamera === null;
    if (cancelled) return null;

    const [image] = await captureImage({
      camera: shouldUseCamera,
    });
    if (!image) {
      return null;
    }

    const imageModel = await Media.getImageModel(image, config.dataPath);

    return imageModel;
  }

  return (
    <PhotoPicker
      getImage={getImageWrap}
      model={model}
      placeholderCount={1}
      {...restProps}
    />
  );
};

export default observer(AppPhotoPicker);
