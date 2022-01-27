/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState, FC } from 'react';
import { observer } from 'mobx-react';
import {
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCard,
  IonRow,
  IonGrid,
  IonCol,
  IonList,
  IonButton,
  IonIcon,
} from '@ionic/react';
import { Gallery, InfoBackgroundMessage } from '@flumens';
import { earthOutline, checkmark } from 'ionicons/icons';
import { Doughnut } from 'react-chartjs-2';
import './styles.scss';

// START Charts doughnut inside text START
const { Chart } = require('react-chartjs-2');

const originalDoughnutDraw = Chart.controllers.doughnut.prototype.draw;
Chart.helpers.extend(Chart.controllers.doughnut.prototype, {
  draw() {
    originalDoughnutDraw.apply(this);

    const { chart } = this.chart;
    const { ctx, width, height } = chart;

    const fontSize = (height / 60).toFixed(2);
    ctx.font = `${fontSize}em Arial`;

    ctx.textBaseline = 'middle';

    const { text } = chart.config.data;
    const textX = Math.round((width - ctx.measureText(text).width) / 2);
    const textY = (chart.chartArea.top + chart.chartArea.bottom) / 2;

    ctx.fillText(text, textX, textY);
  },
});
// END Charts doughnut inside text

const options = {
  cutoutPercentage: 80,
  tooltips: {
    // Disable the on-canvas tooltip
    enabled: false,
  },
  animation: {
    animateRotate: false,
  },
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
  species: any;
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
    const items = species.images.map(showSpImages);

    return (
      <div className="species-profile-photo">
        <Gallery
          isOpen={showGallery}
          items={items}
          initialSlide={photoIndex}
          onClose={hideGallery}
        />
      </div>
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
    const fullSpecies = species;

    const firstFourImages = fullSpecies.images.slice(0, 4);

    const showImage = [
      ...firstFourImages,
      ...new Array(4 - firstFourImages.length),
    ];

    const images = showImage.map(getImage);

    return images;
  };

  const fullSpecies = species;

  const { species: sp, score, images } = fullSpecies;

  const onSelectWrap = () => onSelect(fullSpecies);
  const commonName = !!sp.commonNames.length && sp.commonNames[0];

  return (
    <>
      {getGallery()}

      <IonCard id="species-profile-card">
        <IonCardHeader>
          <div className="species-names-wrapper">
            <IonCardTitle>{commonName}</IonCardTitle>
            <IonCardSubtitle>
              <i>{sp.scientificNameWithoutAuthor}</i>
            </IonCardSubtitle>
          </div>

          {!selectedSpeciesByUser && (
            <Doughnut
              id="doughnut"
              data={getDoughnutData(score)}
              options={options}
              redraw
            />
          )}

          {selectedSpeciesByUser && <IonIcon icon={checkmark} size="large" />}
        </IonCardHeader>

        {!!images.length && (
          <IonGrid>
            <IonRow>{getImages()}</IonRow>
          </IonGrid>
        )}

        {onSelect && (
          <IonList>
            <IonButton
              mode="md"
              fill="outline"
              className="footer"
              onClick={onSelectWrap}
            >
              This is My Plant
            </IonButton>
          </IonList>
        )}

        {!fullSpecies.warehouseId && (
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
