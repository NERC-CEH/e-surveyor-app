import { useEffect, useRef } from 'react';
import { closeCircleOutline, playCircle } from 'ionicons/icons';
import { Button, useToast } from '@flumens';
import { IonIcon } from '@ionic/react';
import introVideo from 'common/videos/CAPTIONED_01_Intro video_What is E-Surveyor_Assemble_V7_020926_mobile_1080p_hevc_small.mp4';

const IntroVideo = () => {
  const introPlayerRef = useRef<HTMLDivElement>(null);
  const introVideoRef = useRef<
    HTMLVideoElement & {
      webkitEnterFullscreen?: () => void;
    }
  >(null);
  const toast = useToast();

  useEffect(() => {
    const video = introVideoRef.current;

    if (!video) return undefined;

    const pause = () => video.pause();
    const onFullscreenChange = () => {
      if (!document.fullscreenElement) video.pause();
    };

    document.addEventListener('fullscreenchange', onFullscreenChange);
    video.addEventListener('webkitendfullscreen', pause);

    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      video.removeEventListener('webkitendfullscreen', pause);
      video.pause();
    };
  }, []);

  const openIntroVideo = async () => {
    const video = introVideoRef.current;
    const player = introPlayerRef.current;

    if (!video || !player) return;

    try {
      // iPhone uses its native video player rather than the standard Fullscreen API.
      if (video.webkitEnterFullscreen) {
        await video.play();
        video.webkitEnterFullscreen();
      } else {
        await Promise.all([player.requestFullscreen(), video.play()]);
      }
    } catch {
      video.pause();
      toast.error('This video could not be played full screen on your device.');
    }
  };

  return (
    <>
      <Button
        shape="round"
        onPress={openIntroVideo}
        prefix={
          <IonIcon icon={playCircle} className="size-7" aria-hidden="true" />
        }
        className="min-h-11 w-fit max-w-full gap-2 border-white/50 bg-white/15 py-1.5 pl-1.5 pr-4 text-sm font-semibold text-white backdrop-blur-sm data-[hovered=true]:bg-white/25"
      >
        Watch the 90-second video
      </Button>

      <div
        ref={introPlayerRef}
        className="group pointer-events-none absolute size-px overflow-hidden bg-black opacity-0 [&:fullscreen]:pointer-events-auto [&:fullscreen]:size-full [&:fullscreen]:opacity-100"
      >
        <Button
          fill="clear"
          shape="round"
          aria-label="Close video"
          onPress={() =>
            document.exitFullscreen().catch(error => toast.error(error))
          }
          className="absolute top-[max(1rem,env(safe-area-inset-top))] right-[max(1rem,env(safe-area-inset-right))] z-10 hidden h-11 w-11 bg-transparent! p-0 text-white shadow-none group-[:fullscreen]:flex"
        >
          <IonIcon
            icon={closeCircleOutline}
            className="size-8"
            aria-hidden="true"
          />
        </Button>

        {/* Captions are burned into the supplied video. */}
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          ref={introVideoRef}
          src={introVideo}
          controls
          playsInline
          preload="metadata"
          tabIndex={-1}
          aria-label="Introduction to e-Surveyor"
          className="size-full object-contain"
        />
      </div>
    </>
  );
};

export default IntroVideo;
