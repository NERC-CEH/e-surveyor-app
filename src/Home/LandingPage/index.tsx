import { useState, FC } from 'react';
import {
  IonLabel,
  IonButton,
  IonCard,
  IonCardTitle,
  IonCardSubtitle,
  IonCardHeader,
  IonIcon,
  isPlatform,
} from '@ionic/react';
import { Grid } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/grid';
import '@ionic/react/css/ionic-swiper.css';
import { Page, Main, device, useToast, captureImage } from '@flumens';
import ImageModel from 'common/models/image';
import Occurrence from 'common/models/occurrence';
import { usePromptImageSource } from 'Components/PhotoPicker';
import config from 'common/config';
import { cameraOutline } from 'ionicons/icons';
import survey1 from './viateur-hwang.jpg';
import survey2 from './ricardo-gomez.jpg';
import survey3 from './andrew-neel.jpg';
import SpeciesProfile from './Components/Species';
import logo from './logo.svg';
import './styles.scss';

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
        grid: { rows: 2 },
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
            spaceBetween={5}
            slidesPerView={1.3}
            {...tabletLayout}
          >
            <SwiperSlide className="survey">
              <IonCard routerLink="/survey/point">
                <div className="card-wrapper">
                  <img src={survey1} alt="" />
                  <IonCardHeader>
                    <IonCardTitle>Record a habitat</IonCardTitle>
                    <IonCardSubtitle>Survey</IonCardSubtitle>
                  </IonCardHeader>
                </div>
              </IonCard>
            </SwiperSlide>

            <SwiperSlide className="survey">
              <IonCard routerLink="/survey/transect">
                <div className="card-wrapper">
                  <img src={survey2} alt="" />
                  <IonCardHeader>
                    <IonCardTitle>Structured recording</IonCardTitle>
                    <IonCardSubtitle>Survey</IonCardSubtitle>
                  </IonCardHeader>
                </div>
              </IonCard>
            </SwiperSlide>

            <SwiperSlide className="survey">
              <IonCard>
                <div className="card-wrapper">
                  <img src={survey3} alt="" />
                  <IonCardHeader>
                    <IonCardTitle>Tree survey</IonCardTitle>
                    <IonCardSubtitle>
                      <i>(Coming soon)</i>
                    </IonCardSubtitle>
                  </IonCardHeader>
                </div>
              </IonCard>
            </SwiperSlide>
          </Swiper>

          <IonButton
            className="identify-plant"
            onClick={identifyPhoto}
            color="light"
          >
            <IonIcon src={cameraOutline} slot="end" />
            <IonLabel>Identify plant</IonLabel>
          </IonButton>
        </div>
      </Main>

      <SpeciesProfile occurrence={species} onClose={hideSpeciesModal} />
    </Page>
  );
};

export default LandingPage;
