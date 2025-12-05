import { ReactNode } from 'react';
import { IonRouterLink } from '@ionic/react';

type Props = {
  children?: ReactNode;
  image: string;
  title: string;
  type: string;
  link: string;
};

const SurveyCard = ({ children, image, title, type, link }: Props) => (
  <IonRouterLink
    routerLink={link}
    className="m-3 h-full max-h-[85vw] w-full overflow-hidden rounded-md bg-white"
  >
    <div className="relative flex h-full w-full flex-col">
      <img
        src={image}
        className="max-h-[66%] min-h-[66%] w-full flex-1 object-cover"
      />

      {children}

      <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-white">
        <h2 className="line-clamp-2 text-lg! font-bold! text-primary-900">
          {title}
        </h2>
        <h3 className="text-primary-950/70 mt-0! text-lg!">{type}</h3>
      </div>
    </div>
  </IonRouterLink>
);

export default SurveyCard;
