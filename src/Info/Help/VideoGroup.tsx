import type { ComponentProps } from 'react';
import { playOutline } from 'ionicons/icons';
import { Trans as T } from 'react-i18next';
import {
  IonAccordion,
  IonAccordionGroup,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
} from '@ionic/react';
import VideoCard from 'common/Components/VideoCard';

type Props = {
  title: string;
  videos: ComponentProps<typeof VideoCard>[];
};

const VideoGroup = ({ title, videos }: Props) => (
  <IonAccordionGroup>
    <IonAccordion className="collapse-block" value={title}>
      <IonItem slot="header">
        <IonIcon
          slot="start"
          icon={playOutline}
          aria-hidden="true"
          className="size-4 text-neutral-900"
        />
        <IonLabel className="ion-text-wrap">
          <div className="flex items-baseline gap-3">
            <span>
              <T>{title}</T>
            </span>
            <span className="shrink-0 whitespace-nowrap text-xs font-normal text-neutral-500">
              {videos.length} {videos.length === 1 ? 'video' : 'videos'}
            </span>
          </div>
        </IonLabel>
      </IonItem>

      <IonList slot="content">
        <IonItem>
          <div className="flex w-full flex-col gap-3 py-3">
            {videos.map(video => (
              <VideoCard key={video.src} {...video} />
            ))}
          </div>
        </IonItem>
      </IonList>
    </IonAccordion>
  </IonAccordionGroup>
);

export default VideoGroup;
