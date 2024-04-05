/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useState, FC } from 'react';
import { observer } from 'mobx-react';
import 'chart.js/auto';
import { earthOutline, checkmark } from 'ionicons/icons';
import { Doughnut } from 'react-chartjs-2';
import { Gallery, device, Button } from '@flumens';
import {
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCard,
  IonRow,
  IonGrid,
  IonCol,
  IonIcon,
} from '@ionic/react';
import { Taxon } from 'models/occurrence';
import InfoBackgroundMessage from 'Components/InfoBackgroundMessage';
import './styles.scss';

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

const SpeciesCard: FC<Props> = ({
  species,
  onSelect,
  selectedSpeciesByUser,
}) => {
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
        <IonCol size="3" key={index}>
          <div className="species-placeholder-images" />
        </IonCol>
      );
    }

    const spImage = sp.url.s;

    const onImageClicked = () => onSpeciesImageClicked(index);

    return (
      <IonCol size="3" key={spImage}>
        <img
          className="species-images"
          src={spImage}
          onClick={onImageClicked}
        />
      </IonCol>
    );
  };

  const getImages = () => {
    const firstFourImages = species.images?.slice(0, 4) || [];

    const showImage = [
      ...firstFourImages,
      ...new Array(4 - firstFourImages.length),
    ];

    const images = showImage.map(getImage);

    return images;
  };

  const { commonName, scientificName, score } = species;
  const images = species.images || [];
  const { isOnline } = device;

  const onSelectWrap = () => onSelect(species);

  return (
    <>
      {getGallery()}

      <IonCard id="species-profile-card">
        <IonCardHeader>
          <div className="wrapper">
            <div className="species-names-wrapper">
              <IonCardTitle>{commonName}</IonCardTitle>
              <IonCardSubtitle>
                <i>{scientificName}</i>
              </IonCardSubtitle>
            </div>

            {!selectedSpeciesByUser && (
              <div id="doughnut">
                <Doughnut
                  data={getDoughnutData(score)}
                  options={options}
                  redraw
                />
                <div className="label">{getDoughnutData(score).text}</div>
              </div>
            )}

            {selectedSpeciesByUser && (
              <IonIcon icon={checkmark} size="large" className="my-auto" />
            )}
          </div>
        </IonCardHeader>

        {!!images.length && isOnline && (
          <IonGrid>
            <IonRow>{getImages()}</IonRow>
          </IonGrid>
        )}

        {onSelect && (
          <Button fill="outline" className="footer" onPress={onSelectWrap}>
            This is My Plant
          </Button>
        )}

        {!species.warehouseId && (
          <InfoBackgroundMessage>
            This plant is not a UK native
            <IonIcon icon={earthOutline} />
          </InfoBackgroundMessage>
        )}
      </IonCard>
    </>
  );
};

export default observer(SpeciesCard);
