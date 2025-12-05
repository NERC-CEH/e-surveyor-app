/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useState } from 'react';
import { observer } from 'mobx-react';
import 'chart.js/auto';
import { earthOutline, checkmark } from 'ionicons/icons';
import { Doughnut } from 'react-chartjs-2';
import { Gallery, device, Button } from '@flumens';
import { IonIcon } from '@ionic/react';
import { Taxon } from 'models/occurrence';
import InfoBackgroundMessage from 'Components/InfoBackgroundMessage';

const options = {
  cutout: '80%',
  layout: {
    padding: { top: -9 }, // for some reason the chart is moved down
  },
  tooltip: { enabled: false }, // Disable the on-canvas tooltip
  animation: { animation: false, animateRotate: false },
};

const getDoughnutData = (score: number) => {
  const scorePercent = parseInt((score * 100).toFixed(0), 10);

  const color = () => {
    if (scorePercent > 70) {
      return '#4b9a43'; // green
    }

    if (scorePercent > 20) {
      return '#ffbc5e'; // yellow
    }

    return '#ff4e46'; // red
  };

  const remainingScorePercent = 100 - scorePercent;

  return {
    datasets: [
      {
        data: [scorePercent, remainingScorePercent],
        backgroundColor: [color(), '#f5f5f5'],
        borderWidth: [0, 0],
      },
    ],
    text: `${scorePercent}%`,
  };
};

interface Props {
  species: Taxon;
  onSelect?: any;
  selectedSpeciesByUser?: any;
}

const SpeciesCard = ({ species, onSelect, selectedSpeciesByUser }: Props) => {
  const [showGallery, setShowGallery] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const hideGallery = () => {
    setShowGallery(false);
    setPhotoIndex(0);
  };

  const getGallery = () => {
    const showSpImages = (img: any) => {
      return {
        src: img.url.m,
        w: 800,
        h: 800,
        author: img.author || '',
      };
    };
    const items = species.images?.map(showSpImages) || [];

    return (
      <Gallery
        isOpen={showGallery}
        items={items}
        initialSlide={photoIndex}
        onClose={hideGallery}
      />
    );
  };

  const onSpeciesImageClicked = (index: number) => {
    setShowGallery(true);
    setPhotoIndex(index);
  };

  const getImage = (sp: any, index: number) => {
    if (!sp) {
      return (
        <div
          key={index}
          className="w-full rounded-[15px] bg-[#f1f1f1] px-0 py-[50%]"
        />
      );
    }

    const spImage = sp.url.s;

    const onImageClicked = () => onSpeciesImageClicked(index);

    return (
      <img
        key={spImage}
        className="overflow-hidden rounded-[15px]"
        src={spImage}
        onClick={onImageClicked}
      />
    );
  };

  const getImages = () => {
    const firstFourImages = species.images?.slice(0, 4) || [];
    const placeholderImages = new Array(4 - firstFourImages.length);
    placeholderImages.fill(null);

    return [...firstFourImages, ...placeholderImages].map(getImage);
  };

  const { commonName, scientificName, score } = species;
  const images = species.images || [];
  const { isOnline } = device;

  const onSelectWrap = () => onSelect(species);

  let localStatus: any;
  if (species.recordCleaner === 'pass')
    localStatus = (
      <div className="flex w-full items-center justify-center border-b border-neutral-400 bg-primary-400/20 p-1 text-sm font-semibold text-neutral-800">
        Locally abundant
      </div>
    );

  if (species.recordCleaner === 'fail')
    localStatus = (
      <div className="flex w-full items-center justify-center border-b border-neutral-400 bg-neutral-100 p-1 text-sm font-semibold text-neutral-800">
        Locally absent
      </div>
    );

  return (
    <>
      {getGallery()}

      <div className="overflow-hidden rounded-md border border-solid border-neutral-300 bg-white [&:first-of-type]:border-[var(--color-primary-800)]">
        {localStatus}

        <div className="flex w-full flex-col gap-2 p-3">
          <div className="flex justify-between gap-2">
            <div className="flex flex-col justify-center">
              <h3 className="font-semibold! my-0!">{commonName}</h3>
              <h3 className="italic opacity-70 my-0!">{scientificName}</h3>
            </div>

            {!selectedSpeciesByUser && (
              <div className="p-[5px]; relative h-[70px] w-[70px] self-center">
                <Doughnut
                  data={getDoughnutData(score)}
                  options={options}
                  redraw
                />
                <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center text-[0.9em] font-medium">
                  {getDoughnutData(score).text}
                </div>
              </div>
            )}

            {selectedSpeciesByUser && (
              <IonIcon
                icon={checkmark}
                size="large"
                className="my-auto"
                color="success"
              />
            )}
          </div>

          {!!images.length && isOnline && (
            <div className="grid grid-cols-4 gap-2">{getImages()}</div>
          )}

          {onSelect && (
            <Button
              fill="outline"
              className="mt-3 p-2 text-sm"
              onPress={onSelectWrap}
            >
              This is My Plant
            </Button>
          )}

          {!species.warehouseId && (
            <InfoBackgroundMessage>
              This plant is not a UK native
              <IonIcon icon={earthOutline} />
            </InfoBackgroundMessage>
          )}
        </div>
      </div>
    </>
  );
};

export default observer(SpeciesCard);
