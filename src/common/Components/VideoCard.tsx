import { play } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';
import VideoButton from './VideoButton';

type Props = {
  src: string;
  title: string;
  poster: string;
  duration: string;
};

const VideoCard = ({ src, title, poster, duration }: Props) => (
  <VideoButton
    src={src}
    label={title}
    className="relative aspect-video w-full overflow-hidden rounded-2xl border-none bg-black p-0 text-white"
  >
    <img src={poster} alt="" className="aspect-video w-full object-cover" />
    <span
      aria-hidden="true"
      className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-black/10"
    />
    <span className="absolute top-3 left-3 text-left text-base font-semibold">
      {title}
    </span>
    <span
      aria-hidden="true"
      className="absolute top-1/2 left-1/2 grid size-14 -translate-1/2 place-items-center rounded-full bg-white/95 text-neutral-900"
    >
      <IonIcon icon={play} className="ml-1 size-7" />
    </span>
    <span className="absolute right-3 bottom-3 rounded-md bg-black/70 px-2 py-0.5 text-xs font-medium">
      {duration}
    </span>
  </VideoButton>
);

export default VideoCard;
