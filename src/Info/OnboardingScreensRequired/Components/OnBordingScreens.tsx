import { FC, ReactNode, useState } from 'react';
import { observer } from 'mobx-react';
import { arrowForward, closeOutline } from 'ionicons/icons';
import SwiperCore from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Button, Page } from '@flumens';
import {
  IonButton,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonIcon,
  IonFooter,
} from '@ionic/react';
import '@ionic/react/css/ionic-swiper.css';
import AppModelType from 'models/app';
import meadowImage from './images/first.jpg';
import denseMeadowImage from './images/fourth.jpg';
import insectImage from './images/insectImage.jpg';
import personImage from './images/personImage.jpg';
import flowersImage from './images/second.jpg';
import seedsImage from './images/third.jpg';
import './styles.scss';

// Fixes iOS 12 scrolling issue.
type MainProps = { children: ReactNode };
const Main: FC<MainProps> = ({ children }) => <div>{children}</div>;

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
              style={{ backgroundImage: `url(${meadowImage})` }}
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
              style={{ backgroundImage: `url(${insectImage})` }}
            >
              <WaveShape />
              <div className="message two">
                <p>
                  Create a survey to identify and record all of the plants in
                  your area, and find out which beneficial insects you are
                  supporting.
                </p>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide className="second">
            <div
              className="slide-header"
              style={{ backgroundImage: `url(${personImage})` }}
            >
              <WaveShape />
              <div className="message two">
                <p>
                  Use the transect (structured recording) method to find out how
                  your habitat performs against industry standard criteria.
                </p>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide className="third">
            <div
              className="slide-header"
              style={{ backgroundImage: `url(${flowersImage})` }}
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

          <SwiperSlide className="fourth">
            <div
              className="slide-header"
              style={{ backgroundImage: `url(${seedsImage})` }}
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

          <SwiperSlide className="fifth">
            <div
              className="slide-header"
              style={{ backgroundImage: `url(${denseMeadowImage})` }}
            >
              <WaveShape />
              <div className="message two">
                <h2>Our expertise</h2>
                <p>
                  Research from the UKCEH built into the app can assess the
                  quality of the habitat you have created.
                </p>

                <Button
                  color="secondary"
                  onPress={exit}
                  className="mx-auto mt-7"
                  suffix={<IonIcon className="size-5" icon={arrowForward} />}
                >
                  Let's start!
                </Button>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </Main>

      {moreSlidesExist && (
        <IonFooter className="ion-no-border">
          <IonToolbar>
            <IonButtons slot="end">
              <IonButton onClick={slideNext}>
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
