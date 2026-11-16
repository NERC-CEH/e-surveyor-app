import { ReactNode } from 'react';
import { IonModal } from '@ionic/react';

const INITIAL_BREAKPOINT = 0.85;

type Props = {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

const IdentificationModal = ({ title, isOpen, onClose, children }: Props) => (
  <IonModal
    isOpen={isOpen}
    backdropDismiss={false}
    breakpoints={[0, INITIAL_BREAKPOINT, 1]}
    initialBreakpoint={INITIAL_BREAKPOINT}
    onDidDismiss={onClose}
    aria-label={title}
    className="[--background:var(--ion-page-background)] [--backdrop-opacity:0.7]! [&>.ion-page]:pt-2"
  >
    <div className="shrink-0 px-4 pt-8 pb-4 text-center text-2xl font-bold">
      {title}
    </div>

    {children}
  </IonModal>
);

export default IdentificationModal;
