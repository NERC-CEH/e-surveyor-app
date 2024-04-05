import { IonRouterLink } from '@ionic/react';

type Props = {
  image: string;
  title: string;
  type: string;
  link: string;
};

const SurveyCard = ({ image, title, type, link }: Props) => (
  <IonRouterLink
    routerLink={link}
    className="m-3 h-full max-h-[85vw] w-full overflow-hidden rounded-md bg-white shadow-2xl"
  >
    <div className="flex h-full w-full flex-col">
      <img
        src={image}
        className="max-h-[66%] min-h-[66%] w-full flex-1 object-cover"
      />

      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-white">
        <h2 className="line-clamp-2 text-lg font-bold text-primary-900">
          {title}
        </h2>
        <h3 className="text-primary-950/70">{type}</h3>
      </div>
    </div>
  </IonRouterLink>
);

export default SurveyCard;
