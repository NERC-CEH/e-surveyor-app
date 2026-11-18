import { useContext, useState } from 'react';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Page, Main, device, useToast, captureImage } from '@flumens';
import { NavContext, IonRouterLink } from '@ionic/react';
import InfoBackgroundMessage from 'common/Components/InfoBackgroundMessage';
import VideoButton from 'common/Components/VideoButton';
import config from 'common/config';
import background from 'common/images/branches.jpg';
import Media from 'common/models/image';
import Location from 'common/models/location';
import Occurrence from 'common/models/occurrence';
import userModel from 'common/models/user';
import introVideo from 'common/videos/CAPTIONED_01_Intro video_What is E-Surveyor_Assemble_V7_020926_mobile_1080p_hevc_small.mp4';
import { usePromptImageSource } from 'Components/PhotoPickers/PhotoPicker';
import { baseURL as ecosystemURL } from 'Survey/Ecosystem/router';
import { baseURL as habitatURL } from 'Survey/Habitat/router';
import { baseURL as soilURL } from 'Survey/Soil/router';
import BeetleProfile from './Components/Beetle';
import Card from './Components/Card';
import FancyButton from './Components/FancyButton';
import HabitatProfile from './Components/Habitat';
import MothProfile from './Components/Moth';
import Notifications from './Components/Notifications';
import SpeciesProfile from './Components/Species';
import beetleID from './beetleID.png';
import ecosystem from './ecosystem.jpg';
import habitat from './habitat.jpg';
import habitatID from './habitatID.png';
import identificationWave from './identificationWave.svg';
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

  return (
    <Page id="home-landing">
      <Main scrollY={false} className="[--background:#020202]!">
        <div className="h-full overflow-y-auto pt-[env(safe-area-inset-top)]">
          <header
            style={{ backgroundImage: `url(${background})` }}
            className="bg-cover bg-center px-6 pt-8 pb-8 text-white"
          >
            <div className="flex items-start justify-between gap-3">
              <img src={logo} alt="UKCEH e-Surveyor" className="w-60 min-w-0" />
              <Notifications />
            </div>

            <p className="mt-6 mb-3 max-w-xs text-lg leading-snug text-white">
              What is e-Surveyor? Read more about it{' '}
              <IonRouterLink
                routerLink="/info/about"
                className="text-white font-bold"
              >
                here
              </IonRouterLink>
              .
            </p>

            <VideoButton
              src={introVideo}
              label="Watch the 90-second video"
              className="min-h-11 w-fit max-w-full gap-2 border-white/50 bg-white/15 py-1.5 pl-1.5 pr-4 text-sm font-semibold text-white backdrop-blur-sm data-[hovered=true]:bg-white/25"
            />
          </header>

          <Swiper
            className="w-full px-5! py-1! [&_.swiper-wrapper]:items-stretch [&_.swiper-slide]:h-auto! [&_.swiper-slide]:flex [&_.swiper-slide]:flex-col"
            slidesPerView={1.65}
            spaceBetween={12}
            breakpoints={{ 768: { slidesPerView: 3 } }}
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
              className="my-6 mx-5 w-[calc(100%-2.5rem)] max-w-none! text-center"
            >
              We’ve updated our{' '}
              <a href={`${config.backend.url}/terms-of-use`}>Terms of Use</a>.
              Please take a moment to review them before continuing.
            </InfoBackgroundMessage>
          )}

          <div className="relative mt-12 pb-25">
            <div
              className="pointer-events-none absolute inset-x-0 -top-10 bottom-0 bg-linear-to-b from-[#25332b]/95 to-[#111a16]/95 backdrop-blur-sm"
              style={{
                maskImage: `url(${identificationWave}), linear-gradient(white, white)`,
                // Overlap the masks by 1px to avoid a subpixel rendering seam.
                maskSize: '100% 2.5rem, 100% calc(100% - 2.5rem + 1px)',
                maskPosition: 'top, bottom',
                maskRepeat: 'no-repeat',
              }}
              aria-hidden="true"
            />

            <div className="relative flex flex-col gap-3 max-w-lg mx-auto px-5 w-full pt-2 pb-6">
              <div className="mb-2 px-1">
                <h2 className="m-0 text-lg font-semibold text-white!">
                  Identify in the field
                </h2>
                <p className="mt-1 mb-0 text-sm text-neutral-300">
                  Get identification suggestions from a photo.
                </p>
              </div>

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
