import { useState } from 'react';
import { cameraOutline } from 'ionicons/icons';
import 'swiper/css';
import 'swiper/css/grid';
import { Grid } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Page, Main, device, useToast, captureImage, Button } from '@flumens';
import { IonIcon, isPlatform } from '@ionic/react';
import '@ionic/react/css/ionic-swiper.css';
import config from 'common/config';
import ImageModel from 'common/models/image';
import Occurrence from 'common/models/occurrence';
import { usePromptImageSource } from 'Components/PhotoPickers/PhotoPicker';
import SpeciesProfile from './Components/Species';
import SurveyCard from './Components/SurveyCard';
import survey3 from './beetleSurvey.jpg';
import logo from './logo.svg';
import survey2 from './ricardo-gomez.jpg';
import './styles.scss';
import survey1 from './viateur-hwang.jpg';

const LandingPage = () => {
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
        <img
          src={logo}
          className="absolute -mt-2 max-h-[150px] w-full bg-white px-[74px] py-[13px]"
        />

        <div className="flex h-full flex-col justify-evenly gap-5 overflow-hidden px-0 pb-[120px] pt-40">
          <Swiper
            centeredSlides
            centeredSlidesBounds
            className="w-[100vw]"
            slidesPerView={1.3}
            {...tabletLayout}
          >
            {/* <SwiperSlide>
              <SurveyCard
                image={survey1}
                title="Moth trap"
                type="Survey"
                link="/survey/moth"
              />
            </SwiperSlide> */}
            <SwiperSlide>
              <SurveyCard
                image={survey1}
                title="Record a habitat"
                type="Survey"
                link="/survey/point"
              />
            </SwiperSlide>
            <SwiperSlide>
              <SurveyCard
                image={survey2}
                title="Structured recording"
                type="Transect survey"
                link="/survey/transect"
              />
            </SwiperSlide>
            <SwiperSlide>
              <SurveyCard
                image={survey3}
                title="Farmland Carabids"
                type="Beetle trap survey"
                link="/survey/beetle"
              />
            </SwiperSlide>
          </Swiper>

          <Button
            className="mx-auto w-fit px-5 text-lg shadow-2xl"
            onPress={identifyPhoto}
            prefix={<IonIcon src={cameraOutline} className="size-6" />}
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
