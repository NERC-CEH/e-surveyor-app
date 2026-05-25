import { IonRouterLink } from '@ionic/react';

type Props = {
  icon?: any;
  header?: any;
  description?: any;
  link?: any;
  moreInfo?: any;
};

const SurveyCard = ({ icon, header, description, link, moreInfo }: Props) => (
  <div className="bg-white rounded-md shadow-md flex flex-col items-center w-full">
    <div className="flex flex-col w-full">
      <div className="flex gap-2 items-center justify-start p-4 font-bold">
        {icon}
        {header}
      </div>
      <div className="bg-neutral-100 border-t border-neutral-200 p-4 text-sm">
        {description}
      </div>
    </div>

    {!!link && (
      <IonRouterLink
        routerLink={link}
        className="text-primary-500 font-bold my-2"
      >
        Start Survey
      </IonRouterLink>
    )}
    {moreInfo}
  </div>
);

export default SurveyCard;
