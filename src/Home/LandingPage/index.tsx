import { useState, FC } from 'react';
import { cameraOutline } from 'ionicons/icons';
import 'swiper/css';
import 'swiper/css/grid';
import { Grid } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Page, Main, device, useToast, captureImage, Button } from '@flumens';
import {
  IonCardTitle,
  IonCardSubtitle,
  IonCardHeader,
  IonIcon,
  isPlatform,
  IonRouterLink,
} from '@ionic/react';
import '@ionic/react/css/ionic-swiper.css';
import config from 'common/config';
import ImageModel from 'common/models/image';
import Occurrence from 'common/models/occurrence';
import { usePromptImageSource } from 'Components/PhotoPickers/PhotoPicker';
import SpeciesProfile from './Components/Species';
import survey3 from './beetleSurvey.jpg';
import logo from './logo.svg';
import survey2 from './ricardo-gomez.jpg';
import './styles.scss';
import survey1 from './viateur-hwang.jpg';

interface Props {}

const LandingPage: FC<Props> = () => {
  const [species, setSpecies] = useState<Occurrence>();
  const toast = useToast();
  const promptImageSource = usePromptImageSource();

  const hideSpeciesModal = () => {
    species?.media.forEach(media => media.destroy());
    setSpecies(undefined);
  };

  const identifyPhoto = async () => {
    if (!device.isOnline) {
      toast.warn('Looks like you are offline!');
      return;
    }

    const shouldUseCamera = await promptImageSource();
    const cancelled = shouldUseCamera === null;
    if (cancelled) return;

    const [image] = await captureImage({ camera: shouldUseCamera });
    if (!image) {
      return;
    }

    const occurrence = new Occurrence({});
    const media = await ImageModel.getImageModel(image, config.dataPath);
    occurrence.media.push(media);
    setSpecies(occurrence);

    try {
      await occurrence.identify();
    } catch (e: any) {
      toast.error(e.message, { position: 'bottom' });
    }
  };

  const tabletLayout = isPlatform('tablet')
    ? {
        modules: [Grid],
        // slidesPerView: 2.3, // uncomment when more than 4 surveys
        slidesPerView: 2,
        centeredSlides: false,
        centeredSlidesBounds: false,
        grid: { rows: 2 }, // for when more than 2 surveys
        spaceBetween: 30,
      }
    : {};

  return (
    <Page id="home-landing">
      <Main>
        <img src={logo} className="logo" />

        <div className="surveys-container">
          <Swiper
            centeredSlides
            centeredSlidesBounds
            className="surveys"
            slidesPerView={1.3}
            {...tabletLayout}
          >
            <SwiperSlide className="survey">
              <div className="m-3 h-full max-h-[85vw] w-full overflow-hidden rounded-md bg-white shadow-md">
                <IonRouterLink routerLink="/survey/point">
                  <div className="card-wrapper">
                    <img src={survey1} alt="" />

                    <IonCardHeader className="bg-white">
                      <IonCardTitle>Record a habitat</IonCardTitle>
                      <IonCardSubtitle>Survey</IonCardSubtitle>
                    </IonCardHeader>
                  </div>
                </IonRouterLink>
              </div>
            </SwiperSlide>

            <SwiperSlide className="survey">
              <div className="m-3 h-full max-h-[85vw] w-full overflow-hidden rounded-md bg-white shadow-md">
                <IonRouterLink routerLink="/survey/transect">
                  <div className="card-wrapper">
                    <img src={survey2} alt="" />

                    <IonCardHeader className="bg-white">
                      <IonCardTitle>Structured recording</IonCardTitle>
                      <IonCardSubtitle>Transect survey</IonCardSubtitle>
                    </IonCardHeader>
                  </div>
                </IonRouterLink>
              </div>
            </SwiperSlide>

            <SwiperSlide className="survey">
              <div className="m-3 h-full max-h-[85vw] w-full overflow-hidden rounded-md bg-white shadow-md">
                <IonRouterLink routerLink="/survey/beetle">
                  <div className="card-wrapper">
                    <img src={survey3} alt="" />

                    <IonCardHeader className="bg-white">
                      <IonCardTitle>Farmland Carabids</IonCardTitle>
                      <IonCardSubtitle>Beetle trap survey</IonCardSubtitle>
                    </IonCardHeader>
                  </div>
                </IonRouterLink>
              </div>
            </SwiperSlide>
          </Swiper>

          <Button
            className="mx-auto w-fit px-5 text-lg shadow-2xl"
            onPress={identifyPhoto}
            startAddon={<IonIcon src={cameraOutline} className="size-6" />}
          >
            Identify plant
          </Button>
        </div>
      </Main>

      <SpeciesProfile occurrence={species} onClose={hideSpeciesModal} />
    </Page>
  );
};

export default LandingPage;
