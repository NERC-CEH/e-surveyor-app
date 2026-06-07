import { ReactNode } from 'react';
import clsx from 'clsx';
import { IonRouterLink } from '@ionic/react';

type Props = {
  children?: ReactNode;
  image: string;
  title: string;
  description?: string;
  link?: string;
  onClick?: () => void;
  className?: string;
};

const Card = ({
  children,
  image,
  title,
  description,
  link,
  onClick,
  className,
}: Props) => (
  <IonRouterLink
    routerLink={link}
    className={clsx(
      'm-1 flex-1 flex flex-col overflow-hidden rounded-md bg-white shadow-md',
      className
    )}
    onClick={onClick}
  >
    <div className="relative flex h-full w-full flex-col">
      <img
        src={image}
        className="min-h-0 flex-1 w-full object-cover max-h-32! m-1 rounded border border-neutral-200"
      />

      {children}

      <div className="flex w-full flex-col items-center justify-center gap-1 bg-white shrink-0 p-3 pt-0">
        <h2 className="line-clamp-2 font-bold! text-primary-900">{title}</h2>
        {!!description && (
          <h3 className="text-primary-950/70 mt-0! text-sm! m-0!">
            {description}
          </h3>
        )}
      </div>
    </div>
  </IonRouterLink>
);

export default Card;
