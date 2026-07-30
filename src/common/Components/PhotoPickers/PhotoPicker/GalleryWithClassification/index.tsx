import { useEffect } from 'react';
import { observer } from 'mobx-react';
import { Gallery } from '@flumens';
import Media from 'models/image';
import ImageFooter from './ImageFooter';

type Props = {
  items: Media[];
  showGallery: number;
  onClose: () => boolean;
  onCrop: any;
  onDelete: any;
};

const Footer = ({ children }: any) => (
  <div className="fixed bottom-0 w-full pb-[26px]">{children}</div>
);

const GalleryComponent = ({
  items,
  showGallery,
  onClose,
  onCrop,
  onDelete,
}: Props) => {
  const getItem = (image: Media) => ({
    src: image.getURL(),
    footer: <ImageFooter image={image} onCrop={onCrop} onDelete={onDelete} />,
  });

  const closeGalleryIfDeletedLastPhoto = () => {
    if (Number.isFinite(showGallery) && !items.length) onClose();
  };
  useEffect(closeGalleryIfDeletedLastPhoto, [items.length]);

  return (
    <Gallery
      isOpen={Number.isFinite(showGallery)}
      items={items.map(getItem)}
      initialSlide={showGallery}
      onClose={onClose}
      Footer={Footer}
    />
  );
};

export default observer(GalleryComponent);
