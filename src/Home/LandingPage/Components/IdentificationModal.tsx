import { ReactNode } from 'react';
import { closeOutline } from 'ionicons/icons';
import { Button } from '@flumens';
import { IonIcon, IonModal } from '@ionic/react';

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
    className="[--background:var(--ion-page-background)] [--backdrop-opacity:0.7]!"
  >
    <div className="flex shrink-0 items-center justify-between border-b border-neutral-200 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-3">
      <h2 className="m-0 text-xl font-semibold">{title}</h2>
      <Button
        fill="clear"
        shape="round"
        aria-label={`Close ${title.toLowerCase()}`}
        onPress={onClose}
        className="h-11 w-11 p-0"
      >
        <IonIcon icon={closeOutline} className="size-6" aria-hidden="true" />
      </Button>
    </div>

    {children}
  </IonModal>
);

export default IdentificationModal;
