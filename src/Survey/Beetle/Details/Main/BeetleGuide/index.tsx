import { useState } from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Badge, Main, ModalHeader } from '@flumens';
import { IonModal } from '@ionic/react';
import beetles from 'common/data/cacheRemote/beetles.json';
import FullScreenPhotoViewer from './FullScreenPhotoViewer';
import './images';
import './styles.scss';

export type Beetle = {
  id: number;
  scientificName: string;
  commonName: string;
  size: string;
  habitat: string;
  breeding: string;
  activity: string;
  dispersal: string;
  predation: string;
  features: string;
  similarSpecies?: string;
  annotations?: string;
};

type Props = {
  isOpen: boolean;
  onClose: any;
};

const BeetleGuide = ({ isOpen, onClose }: Props) => {
  const [showSpecies, setShowSpecies] = useState<Beetle>();
  const [showAnnotations, setShowAnnotations] = useState(false);

  const getEntry = (beetle: Beetle) => (
    <div
      className="relative h-[50vw] w-[50vw] border border-solid border-neutral-300 bg-white pb-6"
      onClick={() => setShowSpecies(beetle)}
      key={beetle.id}
    >
      <img
        src={`/images/${beetle.id}_1.jpg`}
        alt=""
        className="block h-full w-full object-contain"
      />
      <div className="absolute bottom-[-1px] w-full bg-black/60 px-4 py-2 text-sm text-white">
        {beetle.commonName}
      </div>
    </div>
  );

  const [showGallery, setShowGallery] = useState<number>();

  const showPhotoInFullScreen = (index: number) => setShowGallery(index);

  const getSlides = () => {
    const slideOpts = {
      initialSlide: 0,
      speed: 400,
    };

    const getSlide = (imageURL: string, index: number) => {
      const showPhotoInFullScreenWrap = () => showPhotoInFullScreen(index);
      return (
        <SwiperSlide
          key={imageURL}
          onClick={showPhotoInFullScreenWrap}
          className="!h-60 overflow-hidden bg-white"
        >
          <img src={imageURL} />
        </SwiperSlide>
      );
    };

    const slideImage = [
      `/images/${showSpecies?.id}_1.jpg`,
      `/images/${showSpecies?.id}_2.jpg`,
    ].map(getSlide);

    const handleSlideChangeStart = (swiper: any) =>
      setShowAnnotations(swiper.activeIndex === 1);

    return (
      <Swiper
        modules={[Pagination]}
        pagination
        onSlideChange={handleSlideChangeStart}
        className="mb-2.5 overflow-visible bg-white"
        {...slideOpts}
      >
        {slideImage}
      </Swiper>
    );
  };

  const speciesLabelStyle =
    'border-l-primary text-sm leading-5 font-semibold uppercase pl-[5px] border-l-[3px] border-solid';

  return (
    <>
      <IonModal
        isOpen={isOpen}
        backdropDismiss={false}
        className="beetle-guide"
      >
        <ModalHeader title="Guide" onClose={onClose} />
        <Main className="[--padding-bottom:0px] [--padding-top:0px]">
          <div className="grid grid-cols-2">{beetles.map(getEntry)}</div>
        </Main>
      </IonModal>

      <FullScreenPhotoViewer
        species={showSpecies}
        onClose={() => setShowGallery(undefined)}
        showGallery={showGallery}
      />

      <IonModal
        isOpen={!!showSpecies}
        backdropDismiss={false}
        className="beetle-guide-species"
      >
        <ModalHeader
          title={showSpecies?.commonName || ''}
          onClose={() => setShowSpecies(undefined)}
        />
        <Main className="[--padding-bottom:0px] [--padding-top:0px]">
          {getSlides()}

          {showAnnotations && !!showSpecies?.annotations && (
            <div className="-mt-7 border-b border-solid border-neutral-200 bg-neutral-500/5 p-3 pt-10 text-sm">
              {showSpecies?.annotations}
            </div>
          )}
          <div className="">
            <div className="flex flex-col gap-2 border-b border-solid border-neutral-200/60 bg-[var(--ion-page-background)] p-4">
              <h2 className="text-xl font-bold text-primary-900">
                {showSpecies?.commonName}
              </h2>
              <h3 className="text-xl italic">{showSpecies?.scientificName}</h3>
            </div>
            <div className="bg-white p-4">
              <div className="flex flex-col gap-3">
                <div>
                  <h3 className={`${speciesLabelStyle} mr-3 inline`}>Size:</h3>
                  <Badge>{showSpecies?.size}</Badge>
                </div>
                <div>
                  <h3 className={`${speciesLabelStyle} mr-3 inline`}>
                    Breeding:
                  </h3>
                  <Badge>{showSpecies?.breeding}</Badge>
                </div>
                <div>
                  <h3 className={`${speciesLabelStyle} mr-3 inline`}>
                    Dispersal:
                  </h3>
                  <Badge>{showSpecies?.dispersal}</Badge>
                </div>
                <div>
                  <h3 className={`${speciesLabelStyle} mr-3 inline`}>
                    Activity:
                  </h3>
                  <Badge>{showSpecies?.activity}</Badge>
                </div>
                <div>
                  <h3 className={`${speciesLabelStyle} mr-3 inline`}>
                    Habitat:
                  </h3>
                  <Badge>{showSpecies?.habitat}</Badge>
                </div>
              </div>

              <h3 className={`${speciesLabelStyle} mb-2 mt-5`}>Features:</h3>
              <p>{showSpecies?.features}</p>
              <h3 className={`${speciesLabelStyle} mb-2 mt-5`}>Predation:</h3>
              <p>{showSpecies?.predation}</p>
              {!!showSpecies?.similarSpecies && (
                <>
                  <h3 className={`${speciesLabelStyle} mb-2 mt-5`}>
                    Similar species:
                  </h3>
                  <p>{showSpecies?.similarSpecies}</p>
                </>
              )}
            </div>
          </div>
        </Main>
      </IonModal>
    </>
  );
};

export default BeetleGuide;
