/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from 'react';
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
import { Gallery, InfoBackgroundMessage } from '@apps';
import { earthOutline } from 'ionicons/icons';
import PropTypes from 'prop-types';
import './styles.scss';

import { Doughnut, Chart } from 'react-chartjs-2';

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

const options = {
  cutoutPercentage: 80,
};

const getDoughnutData = score => {
  const scorePercent = (score * 100).toFixed(0);

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
        hoverBackgroundColor: ['#3ec556', 'rgba(0,0,0,0)'],
        borderWidth: [0, 0],
      },
    ],
    text: `${scorePercent}%`,
  };
};

class SpeciesCard extends React.Component {
  static propTypes = {
    species: PropTypes.object.isRequired,
    onSelect: PropTypes.func,
  };

  state = {
    showGallery: false,
    photoIndex: 0,
  };

  hideGallery = () => {
    this.setState({
      showGallery: false,
      photoIndex: 0,
    });
  };

  getGallery = () => {
    const { species } = this.props;
    const { showGallery, photoIndex } = this.state;

    if (!showGallery) {
      return null;
    }

    const showSpImages = img => {
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
          isOpen={!!showGallery}
          items={items}
          options={{
            index: photoIndex,
            shareEl: false,
            fullscreenEl: false,
            history: false,
          }}
          onClose={this.hideGallery}
        />
      </div>
    );
  };

  onSpeciesImageClicked = photoIndex =>
    this.setState({
      showGallery: true,
      photoIndex,
    });

  getImage = (sp, index) => {
    const spImage = sp.url.s;

    const onImageClicked = () => this.onSpeciesImageClicked(index);

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

  getImages = () => {
    const { species: fullSpecies } = this.props;

    const firstFourImages = fullSpecies.images.slice(0, 4);
    const images = firstFourImages.map(this.getImage);

    return images;
  };

  render() {
    const { species: fullSpecies, onSelect } = this.props;

    const { species, score, images } = fullSpecies;

    const onSelectWrap = () => onSelect(fullSpecies);

    return (
      <>
        {this.getGallery()}

        <IonCard id="species-profile-card">
          <IonCardHeader>
            <IonCardTitle>{species.commonNames[0]}</IonCardTitle>
            <IonCardSubtitle>
              <i>{species.scientificNameWithoutAuthor}</i>
            </IonCardSubtitle>
          </IonCardHeader>

          {!!images.length && (
            <IonGrid>
              <IonRow size="12">{this.getImages()}</IonRow>
            </IonGrid>
          )}

          <Doughnut
            id="doughnut"
            data={getDoughnutData(score)}
            options={options}
            redraw
          />

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

          {species.notFoundInUK && (
            <InfoBackgroundMessage>
              This plant is not a UK native
              <IonIcon icon={earthOutline} />
            </InfoBackgroundMessage>
          )}
        </IonCard>
      </>
    );
  }
}

export default observer(SpeciesCard);
