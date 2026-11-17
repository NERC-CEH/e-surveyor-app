import { ReactNode, useState } from 'react';
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
import aerialImage from './images/aerial.jpg';
import meadowImage from './images/first.jpg';
import denseMeadowImage from './images/fourth.jpg';
import insectImage from './images/insectImage.jpg';
import mothImage from './images/moth.jpg';
import personImage from './images/personImage.jpg';
import './styles.scss';

// Fixes iOS 12 scrolling issue.
type MainProps = { children: ReactNode };
const Main = ({ children }: MainProps) => <div>{children}</div>;

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

type Props = {
  appModel: typeof AppModelType;
};

const OnboardingScreens = ({ appModel }: Props) => {
  const [moreSlidesExist, setMoreSlidesExist] = useState(true);
  const [controlledSwiper, setControlledSwiper] = useState<SwiperCore>();

  function exit() {
    appModel.data.showedWelcome = true;
  }

  const handleSlideChangeStart = async () => {
    const isEnd = controlledSwiper?.isEnd;
    setMoreSlidesExist(!isEnd);
  };

  const slideNext = () => controlledSwiper?.slideNext();

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
          pagination
          className={
            moreSlidesExist ? undefined : '[&_.swiper-pagination]:hidden'
          }
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
                  e-Surveyor helps you find out how nature is doing on the land
                  you manage, and how it changes over time.
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
                <h2>Habitat, wildlife and soil</h2>
                <p>
                  Surveys are grouped into three areas: Habitat, Ecosystem
                  Function (the insects that pollinate and control pests) and
                  Soil.
                </p>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide className="second">
            <div
              className="slide-header"
              style={{ backgroundImage: `url(${mothImage})` }}
            >
              <WaveShape />
              <div className="message two">
                <h2>Identify what you find</h2>
                <p>
                  Take a photo and the app's AI suggests what it is: plants,
                  habitat types, moths and ground beetles. Experts check your
                  records.
                </p>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide className="third">
            <div
              className="slide-header"
              style={{ backgroundImage: `url(${aerialImage})` }}
            >
              <WaveShape />
              <div className="message two">
                <h2>Add your sites</h2>
                <p>
                  Map your fields, margins and meadows once. Every survey uses
                  them, so you can go back to the same spots each year.
                </p>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide className="fourth">
            <div
              className="slide-header"
              style={{ backgroundImage: `url(${personImage})` }}
            >
              <WaveShape />
              <div className="message two">
                <h2>See your results</h2>
                <p>
                  Get a report after each survey, compare your plants with your
                  seed mix, and watch your results build up over the years.
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
                <h2>Backed by UKCEH science</h2>
                <p>
                  e-Surveyor is built by the UK Centre for Ecology &amp;
                  Hydrology. Every survey you upload helps you, and helps us
                  understand nature on farms.
                </p>

                <Button
                  color="primary"
                  onPress={exit}
                  className="mx-auto mt-7 bg-primary-600"
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
