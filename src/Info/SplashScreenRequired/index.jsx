import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Page, Main } from '@flumens';
import { observer } from 'mobx-react';
import { arrowForward, closeOutline } from 'ionicons/icons';
import {
  IonSlides,
  IonSlide,
  IonButton,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonIcon,
  IonLabel,
  IonFooter,
} from '@ionic/react';
import Log from 'helpers/log';
import './first.jpg';
import './second.jpg';
import './third.jpg';
import './fourth.jpg';
import './styles.scss';

const SplashScreen = ({ appModel }) => {
  const [moreSlidesExist, setMoreSlidesExist] = useState(true);

  function exit() {
    Log('Info:Welcome:Controller: exit.');
    // eslint-disable-next-line no-param-reassign
    appModel.attrs.showedWelcome = true;
    appModel.save();
  }
  const slideRef = useRef(null);

  const handleSlideChangeStart = async () => {
    const isEnd = await slideRef.current.isEnd();
    setMoreSlidesExist(!isEnd);
  };

  const onIonSlidesDidLoadWrap = e => {
    // TODO: remove once bug is fixed
    // https://github.com/ionic-team/ionic/issues/19641
    // https://github.com/ionic-team/ionic/issues/19638
    e.target.update();
  };

  const slideNext = () => slideRef.current.swiper.slideNext();

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
        <IonSlides
          pager={moreSlidesExist}
          ref={slideRef}
          onIonSlideWillChange={handleSlideChangeStart}
          onIonSlidesDidLoad={onIonSlidesDidLoadWrap}
        >
          <IonSlide className="first">
            <div className="slide-header">
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
              <div className="message">
                <h2>Welcome</h2>
                <p>
                  E-Surveyor helps you to assess the quality of habitats you
                  manage.
                </p>
              </div>
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
            </div>
          </IonSlide>

          <IonSlide className="second">
            <div className="slide-header">
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
              <div className="message two">
                <h2>Identify plants</h2>
                <p>
                  Using AI technology the app can help you to identify plant
                  species from images you take.
                </p>
              </div>
            </div>
          </IonSlide>

          <IonSlide className="third">
            <div className="slide-header">
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
              <div className="message two">
                <h2>Compare what you see</h2>
                <p>
                  Compare the species present in your habitat to those in your
                  seed mix or against benchmark species lists.
                </p>
              </div>
            </div>
          </IonSlide>

          <IonSlide className="fourth">
            <div className="slide-header">
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
          </IonSlide>
        </IonSlides>
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

SplashScreen.propTypes = {
  appModel: PropTypes.object.isRequired,
};

const onBoardingScreens = ({ appModel, children }) => {
  const { showedWelcome } = appModel.attrs;

  if (!showedWelcome) {
    return <SplashScreen appModel={appModel} />;
  }

  return children;
};

onBoardingScreens.propTypes = {
  appModel: PropTypes.object.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default observer(onBoardingScreens);
