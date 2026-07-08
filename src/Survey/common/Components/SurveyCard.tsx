import { useContext } from 'react';
import { IonIcon, NavContext } from '@ionic/react';
import { Button } from 'common/flumens';

type Props = {
  icon?: any;
  header?: any;
  description?: any;
  className?: string;
  link?: any;
  moreInfo?: any;
};

const SurveyCard = ({
  icon,
  header,
  description,
  link,
  moreInfo,
  className,
}: Props) => {
  const { navigate } = useContext(NavContext);

  const openPage = () => navigate(link);

  return (
    <div
      className={`bg-white rounded-md shadow-md flex flex-col items-center w-full ${className}`}
    >
      <div className="flex flex-col w-full">
        <div className="flex text-secondary-900 gap-4 items-center justify-start p-2 font-bold bg-secondary-200/10">
          {!!icon && (
            <IonIcon
              icon={icon}
              className="text-xl rounded-full bg-secondary-800/10 p-2"
            />
          )}
          {header}
        </div>
        <div className="bg-secondary-100/10 border-t border-neutral-200 p-4 text-sm">
          {description}

          {!!link && (
            <Button
              onPress={openPage}
              className="font-bold mt-4 mx-auto py-1 "
              color="secondary"
            >
              Start Survey
            </Button>
          )}

          {!link && (
            <Button className="font-bold mt-4 mx-auto py-1 " isDisabled>
              Coming soon...
            </Button>
          )}
        </div>
      </div>

      {moreInfo}
    </div>
  );
};

export default SurveyCard;
