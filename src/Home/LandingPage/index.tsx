import { useContext, useRef, useState } from 'react';
import 'swiper/css';
import 'swiper/css/grid';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Page, Main, device, useToast, captureImage } from '@flumens';
import { NavContext, isPlatform, IonRouterLink } from '@ionic/react';
import InfoBackgroundMessage from 'common/Components/InfoBackgroundMessage';
import config from 'common/config';
import Media from 'common/models/image';
import Occurrence from 'common/models/occurrence';
import userModel from 'common/models/user';
import { usePromptImageSource } from 'Components/PhotoPickers/PhotoPicker';
import { baseURL as ecosystemURL } from 'Survey/Ecosystem/router';
import { baseURL as habitatURL } from 'Survey/Habitat/router';
import { baseURL as soilURL } from 'Survey/Soil/router';
import Card from './Components/Card';
import FancyButton from './Components/FancyButton';
import SpeciesProfile from './Components/Species';
import background from './background.png';
import ecosystem from './ecosystem.png';
import habitat from './habitat.png';
import habitatID from './habitatID.png';
import logo from './logo.svg';
import plantID from './plantID.png';
import soil from './soil.png';

// hide the terms updated message after this date
const TERMS_MESSAGE_EXPIRY = new Date('2027-06-01');
const showTermsMessage = new Date() < TERMS_MESSAGE_EXPIRY;

const LandingPage = () => {
  const [species, setSpecies] = useState<Occurrence>();
  const toast = useToast();
  const promptImageSource = usePromptImageSource();
  const context = useContext(NavContext);

  const hideSpeciesModal = () => {
    species?.media.forEach(media => media.destroy());
    setSpecies(undefined);
  };

  const identifyPhoto = async () => {
    if (!userModel.isLoggedIn()) {
      context.navigate('/user/register');
      return;
    }

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
    const media = (await Media.getImageModel(
      image,
      config.dataPath,
      true
    )) as Media;

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
        slidesPerView: 3,
      }
    : {};

  const overlayRef = useRef<HTMLDivElement>(null);

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    // max opacity at full scroll
    const maxOpacity = 0.7;
    const progress = scrollTop / (scrollHeight - clientHeight);
    const opacity = progress * maxOpacity;

    if (overlayRef.current) overlayRef.current.style.opacity = String(opacity);
  };

  return (
    <Page id="home-landing">
      <Main scrollY={false}>
        <div
          style={{ backgroundImage: `url(${background})` }}
          className="absolute w-full top-0 bg-cover text-white p-10 pb-40"
        >
          <img src={logo} className="max-w-3/4 w-full" />

          <div className="mt-6">
            What is e-Surveyor? Read more about it{' '}
            <IonRouterLink href="/info/about" className="text-white font-bold">
              here
            </IonRouterLink>
            .
          </div>
        </div>

        {/* darkening overlay that increases with scroll */}
        <div
          ref={overlayRef}
          className="absolute size-full z-30 bg-black opacity-0 pointer-events-none"
        />

        <div
          className="absolute h-full z-50 pt-[35vh] pb-25 overflow-scroll"
          onScroll={onScroll}
        >
          <Swiper
            className="w-screen py-5! [&_.swiper-wrapper]:items-stretch [&_.swiper-slide]:h-auto! [&_.swiper-slide]:flex [&_.swiper-slide]:flex-col"
            slidesPerView={2.3}
            {...tabletLayout}
          >
            <SwiperSlide>
              <Card
                image={habitat}
                title="Habitat"
                description="Recording habitat type, structure and vegetation"
                link={habitatURL}
              />
            </SwiperSlide>
            <SwiperSlide>
              <Card
                image={ecosystem}
                title="Ecosystem Function"
                description="Habitats, Moths, Carabids and Day-time pollinators"
                link={ecosystemURL}
              />
            </SwiperSlide>
            <SwiperSlide>
              <Card
                image={soil}
                title="Soil"
                description="Assessing below-ground condition and resilience"
                link={soilURL}
              />
            </SwiperSlide>
          </Swiper>

          {showTermsMessage && (
            <InfoBackgroundMessage
              name="showTermsUpdatedMessage"
              className="mb-6 max-w-2/3 w-full text-center"
            >
              We’ve updated our{' '}
              <a href={`${config.backend.url}/terms-of-use`}>Terms of Use</a>.
              Please take a moment to review them before continuing.
            </InfoBackgroundMessage>
          )}

          <div className="border-y border-black/10 bg-black/5">
            <div className="flex flex-col gap-2 max-w-lg mx-auto px-3 w-full py-[3vh]">
              <FancyButton
                icon={plantID}
                label="Identify plant"
                onClick={identifyPhoto}
                description="Identify a plant from a photo"
              />
              <FancyButton
                icon={habitatID}
                label="Identify habitat"
                onClick={() => toast.warn('Work in progress.')}
                description="Get habitat suggestions"
              />
            </div>
          </div>
        </div>
      </Main>

      <SpeciesProfile occurrence={species} onClose={hideSpeciesModal} />
    </Page>
  );
};

export default LandingPage;
