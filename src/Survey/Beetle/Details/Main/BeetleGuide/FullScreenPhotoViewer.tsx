/* eslint-disable @getify/proper-arrows/name */
import { FC } from 'react';
import clsx from 'clsx';
import 'swiper/css';
import 'swiper/css/pagination';
import { Gallery, useOnHideModal } from '@flumens';
import '@ionic/react/css/ionic-swiper.css';
import { Beetle } from '.';

// import '../styles.scss';

type Props = {
  species?: Beetle;
  onClose: () => void;
  showGallery?: number;
};

const FullScreenPhotoViewer: FC<Props> = ({
  species,
  onClose,
  showGallery,
}) => {
  let items: any = [];
  let initialSlide = 0;
  let className = 'white-background';
  const pageTitle = '';

  useOnHideModal(onClose);

  const swiperProps: any = {};

  if (Number.isInteger(showGallery)) {
    items = [
      { src: `/images/${species?.id}_1.jpg` },
      { src: `/images/${species?.id}_2.jpg` },
    ];
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
