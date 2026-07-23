import clsx from 'clsx';
import { IonRouterLink } from '@ionic/react';

type Props = {
  image: string;
  title: string;
  description?: string;
  link?: string;
  onClick?: () => void;
  className?: string;
  theme?: 'light' | 'soil' | 'habitat' | 'ecosystem';
};

const Card = ({
  image,
  title,
  description,
  link,
  onClick,
  theme = 'light',
  className,
}: Props) => (
  <IonRouterLink
    routerLink={link}
    className={clsx(
      'm-1 h-full overflow-hidden rounded-md shadow-md bg-white',
      theme === 'soil' &&
        'bg-soil-200/10 text-soil-950 border border-soil-800/50',
      theme === 'habitat' &&
        'bg-habitat-200/10 text-habitat-950 border border-habitat-800/50',
      theme === 'ecosystem' &&
        'bg-ecosystem-200/10 text-ecosystem-950 border border-ecosystem-800/50',
      className
    )}
    onClick={onClick}
  >
    <div
      className={clsx(
        'flex size-full flex-col',
        theme === 'light' && 'bg-white',
        theme === 'soil' && 'bg-soil-200/10 text-soil-950',
        theme === 'habitat' && 'bg-habitat-200/10 text-habitat-950 ',
        theme === 'ecosystem' && 'bg-ecosystem-200/10 text-ecosystem-950 '
      )}
    >
      <img
        src={image}
        className="shrink-0 flex-1 w-full object-cover h-3/7! m-1 rounded border border-neutral-200"
      />

      <div className="flex size-full flex-col items-center justify-evenly gap-1  p-3 pt-0">
        <div className="line-clamp-2 text-base font-bold!">{title}</div>
        {!!description && <div className="text-sm! m-0!">{description}</div>}
      </div>
    </div>
  </IonRouterLink>
);

export default Card;
