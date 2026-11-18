import { type ReactNode, useEffect, useRef } from 'react';
import { closeCircleOutline, playCircle } from 'ionicons/icons';
import { Button, useToast } from '@flumens';
import { IonIcon } from '@ionic/react';

type Props = {
  src: string;
  label: string;
  className?: string;
  children?: ReactNode;
};

const VideoButton = ({ src, label, className, children }: Props) => {
  const playerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<
    HTMLVideoElement & {
      webkitEnterFullscreen?: () => void;
    }
  >(null);
  const toast = useToast();

  useEffect(() => {
    const video = videoRef.current;

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

  const openVideo = async () => {
    const video = videoRef.current;
    const player = playerRef.current;

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
        onPress={openVideo}
        aria-label={label}
        skipTranslation={!!children}
        prefix={
          !children && (
            <IonIcon icon={playCircle} className="size-7" aria-hidden="true" />
          )
        }
        className={className}
      >
        {children ?? label}
      </Button>

      <div
        ref={playerRef}
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
          ref={videoRef}
          src={src}
          controls
          playsInline
          preload="metadata"
          tabIndex={-1}
          aria-label={label}
          className="size-full object-contain"
        />
      </div>
    </>
  );
};

export default VideoButton;
