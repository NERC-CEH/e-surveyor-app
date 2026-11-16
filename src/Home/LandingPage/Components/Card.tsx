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
      'flex h-full flex-col overflow-hidden rounded-2xl border text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-300',
      theme === 'light' && 'border-neutral-950/85 bg-white',
      theme === 'soil' && 'border-soil-950/85 bg-soil-50',
      theme === 'habitat' && 'border-habitat-950/85 bg-habitat-50',
      theme === 'ecosystem' && 'border-ecosystem-950/85 bg-ecosystem-50',
      className
    )}
    onClick={onClick}
  >
    <img
      src={image}
      alt=""
      className="aspect-3/2 w-full shrink-0 object-cover"
    />

    <div className="flex flex-1 flex-col gap-2 p-4">
      <div className="text-base font-semibold text-neutral-900">{title}</div>
      {!!description && (
        <div className="flex-1 text-sm leading-relaxed text-neutral-600">
          {description}
        </div>
      )}
    </div>
  </IonRouterLink>
);

export default Card;
