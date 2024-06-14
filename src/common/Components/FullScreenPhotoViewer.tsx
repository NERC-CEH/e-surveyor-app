/* eslint-disable @getify/proper-arrows/name */
import clsx from 'clsx';
import 'swiper/css';
import 'swiper/css/pagination';
import { Gallery, useOnHideModal } from '@flumens';
import '@ionic/react/css/ionic-swiper.css';

type URL = string;

type Props = {
  photos: URL[] | [URL, string][];
  onClose: () => void;
  showGallery?: number;
};

const FullScreenPhotoViewer = ({ photos, onClose, showGallery }: Props) => {
  let items: any = [];
  let initialSlide = 0;
  let className = 'white-background';
  const pageTitle = '';

  useOnHideModal(onClose);

  const swiperProps: any = {};

  if (Number.isInteger(showGallery)) {
    items = photos?.map((photoArr: string | string[]) => {
      if (Array.isArray(photoArr)) {
        return {
          src: photoArr[0],
          footer: photoArr[1],
        };
      }

      return { src: photoArr };
    });
    initialSlide = showGallery || 0;
    className = '';
  }

  const isOpen = !!items.length && Number.isInteger(showGallery);

  return (
    <Gallery
      isOpen={isOpen}
      items={items}
      initialSlide={initialSlide}
      onClose={onClose}
      className={clsx('species-profile-gallery', className)}
      title={pageTitle}
      mode="md"
      swiperProps={swiperProps}
    />
  );
};

export default FullScreenPhotoViewer;
