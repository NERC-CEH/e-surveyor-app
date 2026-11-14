import { useContext, useRef, useState } from 'react';
import 'swiper/css';
import 'swiper/css/grid';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Page, Main, device, useToast, captureImage } from '@flumens';
import { NavContext, isPlatform, IonRouterLink } from '@ionic/react';
import InfoBackgroundMessage from 'common/Components/InfoBackgroundMessage';
import config from 'common/config';
import background from 'common/images/branches.jpg';
import Media from 'common/models/image';
import Location from 'common/models/location';
import Occurrence from 'common/models/occurrence';
import userModel from 'common/models/user';
import { usePromptImageSource } from 'Components/PhotoPickers/PhotoPicker';
import { baseURL as ecosystemURL } from 'Survey/Ecosystem/router';
import { baseURL as habitatURL } from 'Survey/Habitat/router';
import { baseURL as soilURL } from 'Survey/Soil/router';
import BeetleProfile from './Components/Beetle';
import Card from './Components/Card';
import FancyButton from './Components/FancyButton';
import HabitatProfile from './Components/Habitat';
import MothProfile from './Components/Moth';
import SpeciesProfile from './Components/Species';
import beetleID from './beetleID.png';
import ecosystem from './ecosystem.jpg';
import habitat from './habitat.jpg';
import habitatID from './habitatID.png';
import logo from './logo.svg';
import mothID from './mothID.png';
import plantID from './plantID.png';
import soil from './soil.jpg';

// hide the terms updated message after this date
const TERMS_MESSAGE_EXPIRY = new Date('2027-06-01');
const showTermsMessage = new Date() < TERMS_MESSAGE_EXPIRY;

const LandingPage = () => {
  const [species, setSpecies] = useState<Occurrence>();
  const [moth, setMoth] = useState<Occurrence>();
  const [beetle, setBeetle] = useState<Occurrence>();
  const [habitatLocation, setHabitatLocation] = useState<Location>();
  const toast = useToast();
  const promptImageSource = usePromptImageSource();
  const context = useContext(NavContext);

  const hideSpeciesModal = () => {
    species?.media.forEach(media => media.destroy());
    setSpecies(undefined);
  };

  const hideMothModal = () => {
    moth?.media.slice().forEach(media => media.destroy());
    setMoth(undefined);
  };

  const hideBeetleModal = () => {
    beetle?.media.slice().forEach(media => media.destroy());
    setBeetle(undefined);
  };

  const hideHabitatModal = () => setHabitatLocation(undefined);

  const canIdentify = () => {
    if (!userModel.isLoggedIn()) {
      context.navigate('/user/register');
      return false;
    }

    if (!device.isOnline) {
      toast.warn('Looks like you are offline!');
      return false;
    }

    return true;
  };

  const pickIdentificationPhotos = async (multiple = false) => {
    const shouldUseCamera = await promptImageSource();
    const cancelled = shouldUseCamera === null;
    if (cancelled) return [];

    if (multiple && !shouldUseCamera) return captureImage({ multiple: true });

    return captureImage({ camera: shouldUseCamera });
  };

  const identifyHabitat = async () => {
    if (!canIdentify()) return;

    const photoURLs = await pickIdentificationPhotos(true);
    if (!photoURLs?.length) return;

    const location = new Location({ skipStore: true }); // create a non-persistent location to hold the photos and suggestions

    // attach selected photos before opening the modal so it auto-fetches
    const attach = async (photoURL: string) => {
      const media = await Media.getImageModel(photoURL);

      location.media.push(media);
    };

    await Promise.all(photoURLs.map(attach));

    setHabitatLocation(location);
  };

  const identifyPhoto = async () => {
    if (!canIdentify()) return;

    const [image] = await pickIdentificationPhotos();
    if (!image) return;

    const occurrence = new Occurrence({});
    const media = await Media.getImageModel(image);

    occurrence.media.push(media);
    setSpecies(occurrence);

    try {
      await occurrence.identify();
    } catch (error) {
      toast.error(error, { position: 'bottom' });
    }
  };

  const identifyMoth = async () => {
    if (!canIdentify()) return;

    const [image] = await pickIdentificationPhotos();
    if (!image) return;

    const occurrence = new Occurrence({});
    const media = await Media.getImageModel(image);

    occurrence.media.push(media);
    setMoth(occurrence);

    try {
      await occurrence.identify('moth');
    } catch (error) {
      toast.error(error, { position: 'bottom' });
    }
  };

  const identifyBeetle = async () => {
    if (!canIdentify()) return;

    const [image] = await pickIdentificationPhotos();
    if (!image) return;

    const occurrence = new Occurrence({});
    const media = await Media.getImageModel(image);

    occurrence.media.push(media);
    setBeetle(occurrence);

    try {
      await occurrence.identify('beetle');
    } catch (error) {
      toast.error(error, { position: 'bottom' });
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
      <Main scrollY={false} className="bg-ion-neutral-500!">
        <div
          style={{ backgroundImage: `url(${background})` }}
          className="absolute w-full top-[env(safe-area-inset-top)] bg-cover bg-center text-white p-10 pb-40"
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
                theme="habitat"
              />
            </SwiperSlide>
            <SwiperSlide>
              <Card
                image={ecosystem}
                title="Ecosystem Function"
                description="Habitats, Moths, Carabids and Day-time pollinators"
                link={ecosystemURL}
                theme="ecosystem"
              />
            </SwiperSlide>
            <SwiperSlide>
              <Card
                image={soil}
                title="Soil"
                description="Assessing below-ground condition and resilience"
                link={soilURL}
                theme="soil"
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
            <div className="list max-w-lg mx-auto px-3 w-full py-[3vh]">
              <FancyButton
                icon={plantID}
                label="Identify plant"
                onClick={identifyPhoto}
                description="Identify a plant from a photo"
              />
              <FancyButton
                icon={habitatID}
                label="Identify habitat"
                onClick={identifyHabitat}
                description="Get habitat suggestions"
              />
              <FancyButton
                icon={mothID}
                label="Identify moth"
                onClick={identifyMoth}
                description="Identify a moth from a photo"
              />
              <FancyButton
                icon={beetleID}
                label="Identify beetle"
                onClick={identifyBeetle}
                description="Identify a beetle from a photo"
              />
            </div>
          </div>
        </div>
      </Main>

      <SpeciesProfile occurrence={species} onClose={hideSpeciesModal} />
      <MothProfile occurrence={moth} onClose={hideMothModal} />
      <BeetleProfile occurrence={beetle} onClose={hideBeetleModal} />
      <HabitatProfile location={habitatLocation} onClose={hideHabitatModal} />
    </Page>
  );
};

export default LandingPage;
