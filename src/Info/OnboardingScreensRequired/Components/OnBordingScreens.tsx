import React, { FC, useState } from 'react';
import AppModelType from 'models/app';
import { Page, Main } from '@flumens';
import { observer } from 'mobx-react';
import { arrowForward, closeOutline } from 'ionicons/icons';
import {
  IonButton,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonIcon,
  IonLabel,
  IonFooter,
} from '@ionic/react';
import SwiperCore, { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import '@ionic/react/css/ionic-swiper.css';
import firstImage from './images/first.jpg';
import secondImage from './images/second.jpg';
import thirdImage from './images/third.jpg';
import fourthImage from './images/fourth.jpg';
import './styles.scss';

const WaveShape = () => (
  <div className="custom-shape-divider-bottom-1593438501">
    <svg
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
    >
      <path
        d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
        className="shape-fill"
      />
    </svg>
  </div>
);

interface Props {
  appModel: typeof AppModelType;
}

const OnboardingScreens: FC<Props> = ({ appModel }) => {
  const [moreSlidesExist, setMoreSlidesExist] = useState(true);
  const [controlledSwiper, setControlledSwiper] = useState<SwiperCore>();

  function exit() {
    // eslint-disable-next-line no-param-reassign
    appModel.attrs.showedWelcome = true;
  }

  const handleSlideChangeStart = async () => {
    const isEnd = controlledSwiper && controlledSwiper.isEnd;
    setMoreSlidesExist(!isEnd);
  };

  const slideNext = () => controlledSwiper && controlledSwiper.slideNext();

  return (
    <Page id="welcome-page">
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonButtons slot="end">
            {moreSlidesExist && (
              <IonButton color="none" onClick={exit}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            )}
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <Main>
        <Swiper
          onSwiper={setControlledSwiper}
          modules={[Pagination]}
          pagination={moreSlidesExist}
          onSlideChange={handleSlideChangeStart}
        >
          <SwiperSlide className="first">
            <div
              className="slide-header"
              style={{ backgroundImage: `url(${firstImage})` }}
            >
              <WaveShape />
              <div className="message">
                <h2>Welcome</h2>
                <p>
                  E-Surveyor helps you to assess the quality of habitats you
                  manage.
                </p>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide className="second">
            <div
              className="slide-header"
              style={{ backgroundImage: `url(${secondImage})` }}
            >
              <WaveShape />
              <div className="message two">
                <h2>Identify plants</h2>
                <p>
                  Using AI technology the app can help you to identify plant
                  species from images you take.
                </p>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide className="third">
            <div
              className="slide-header"
              style={{ backgroundImage: `url(${thirdImage})` }}
            >
              <WaveShape />
              <div className="message two">
                <h2>Compare what you see</h2>
                <p>
                  Compare the species present in your habitat to those in your
                  seed mix or against benchmark species lists.
                </p>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide className="fourth">
            <div
              className="slide-header"
              style={{ backgroundImage: `url(${fourthImage})` }}
            >
              <WaveShape />
              <div className="message two">
                <h2>Our expertise</h2>
                <p>
                  Research from the UKCEH built into the app can assess the
                  quality of the habitat you have created.
                </p>

                <IonButton fill="clear" onClick={exit}>
                  <IonLabel>Let's start!</IonLabel>
                  <IonIcon slot="end" icon={arrowForward} />
                </IonButton>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </Main>

      {moreSlidesExist && (
        <IonFooter className="ion-no-border">
          <IonToolbar>
            <IonButtons slot="end">
              <IonButton color="none" onClick={slideNext}>
                <IonIcon icon={arrowForward} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonFooter>
      )}
    </Page>
  );
};

export default observer(OnboardingScreens);
