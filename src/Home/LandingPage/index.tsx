import React, { useState, FC } from 'react';
import {
  IonModal,
  IonLabel,
  IonButton,
  IonCard,
  IonCardTitle,
  IonCardSubtitle,
  IonCardHeader,
  IonIcon,
} from '@ionic/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import '@ionic/react/css/ionic-swiper.css';
import { Page, Main, ModalHeader, device, toast } from '@flumens';
import ImageHelp from 'common/Components/PhotoPicker/imageUtils';
import ImageModel from 'common/models/image';
import identifyImage from 'common/services/plantNet';
import config from 'common/config';
import { cameraOutline } from 'ionicons/icons';
import survey1 from './viateur-hwang.jpg';
import survey2 from './ricardo-gomez.jpg';
import survey3 from './andrew-neel.jpg';
import SpeciesProfile from './Components/SpeciesProfile';
import logo from './logo.svg';
// import homePageBackground from './background.jpg';
import './styles.scss';

// const style = {
//   backgroundImage: `url(${homePageBackground})`,
// };

const { warn } = toast;
interface Props {}

const LandingPage: FC<Props> = () => {
  const [image, setImage] = useState<any>(null);

  const hideSpeciesModal = () => setImage(null);

  const getModal = () => (
    <IonModal isOpen={!!image} backdropDismiss={false}>
      <ModalHeader title="Species" onClose={hideSpeciesModal} />
      <SpeciesProfile species={image} />
    </IonModal>
  );

  const identifyPhoto = async () => {
    if (!device.isOnline()) {
      warn('Looks like you are offline!');
      return;
    }

    const photo = await ImageHelp.getImage();
    if (!photo) {
      return;
    }

    const media = await ImageHelp.getImageModel(
      ImageModel,
      photo,
      config.dataPath
    );

    setImage(media);

    media.identification.identifying = true;
    try {
      const species = (await identifyImage(media)) || [];

      media.identification.identifying = false;
      media.attrs.species = species;
    } catch (err) {
      media.identification.identifying = false;
    }
  };

  return (
    <Page id="home-landing">
      <Main>
        <img src={logo} className="logo" />

        <div className="surveys-container">
          <Swiper className="surveys" spaceBetween={20} slidesPerView={1.3}>
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

      {getModal()}
    </Page>
  );
};

export default LandingPage;
