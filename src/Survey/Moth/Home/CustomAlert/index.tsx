import { ReactNode } from 'react';
import clsx from 'clsx';
import { IonBackdrop } from '@ionic/react';
import './styles.scss';

type Props = {
  children: ReactNode;
  className?: string;
};

function CustomAlert({ children, className }: Props) {
  return (
    <div className={clsx('custom-alert', className)}>
      <IonBackdrop tappable visible stopPropagation />
      <div className="message">{children}</div>
    </div>
  );
}

export default CustomAlert;
