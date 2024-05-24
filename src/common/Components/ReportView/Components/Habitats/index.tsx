import { useEffect, useState } from 'react';
import { InfoBackgroundMessage, ModalHeader } from '@flumens';
import { device } from '@flumens/ionic/dist';
import { IonItem, IonList, IonModal, IonSkeletonText } from '@ionic/react';
import {
  identifyBroad,
  identifyNVC,
  BroadHabitat,
  NVCHabitat,
} from 'common/services/habitats';
import InfoButtonPopover from 'Components/InfoButton';
import { SpeciesNames } from '../../helpers';
import Habitat from './Habitat';

type Props = {
  uniqueSpecies: SpeciesNames[];
};

const Habitats = ({ uniqueSpecies }: Props) => {
  const [showModal, setShowModal] = useState<BroadHabitat>();

  const [isLoading, setIsLoading] = useState(false);
  const [broadHabitats, setBroadHabitats] = useState<BroadHabitat[]>();
  const [, setNVCHabitats] = useState<NVCHabitat[]>();

  const refreshHabitats = () => {
    (async () => {
      if (!device.isOnline) return;

      console.log('Refreshing habitats');
      setIsLoading(true);
      try {
        const exists = (o: any) => !!o;
        const speciesTVKs = uniqueSpecies
          .map(([, , tvk]) => tvk!)
          .filter(exists);

        const [newBroadHabitats, newNvcHabitats] = await Promise.all([
          identifyBroad(speciesTVKs),
          identifyNVC(speciesTVKs),
        ]);

        setBroadHabitats(newBroadHabitats);
        setNVCHabitats(newNvcHabitats);
      } catch (error) {
        console.error(error);
      }
      setIsLoading(false);
    })();
  };
  useEffect(refreshHabitats, [uniqueSpecies]);

  if (!broadHabitats?.length && !isLoading) {
    return (
      <InfoBackgroundMessage className="my-3">
        This report does not have any matching habitats.
      </InfoBackgroundMessage>
    );
  }

  const getLoader = () => {
    const habitatLoader = (
      <IonItem>
        <div className="flex w-full items-center justify-between gap-20 py-2">
          <div className="flex w-full flex-col">
            <IonSkeletonText animated className="w-full rounded-md" />
            <IonSkeletonText animated className="w-1/2 rounded-md opacity-50" />
          </div>
          <IonSkeletonText animated className="size-7 shrink-0 rounded-md" />
        </div>
      </IonItem>
    );

    return (
      <>
        {habitatLoader}
        {habitatLoader}
        {habitatLoader}
      </>
    );
  };

  const getHabitatItem = (habitat: BroadHabitat) => (
    <IonItem key={habitat.UKHab} onClick={() => setShowModal(habitat)}>
      <div className="flex w-full items-center justify-between gap-2 py-2">
        <div className="flex flex-col">
          <div className="line-clamp-2 font-semibold text-black/85">
            {habitat.broadHabitat}
          </div>
          <div className="line-clamp-1 text-sm opacity-80">
            UKHab = {habitat.UKHab}
          </div>
        </div>
        <div className="text-[var(--form-value-color)]">
          {habitat.matchingCoefficient}%
        </div>
      </div>
    </IonItem>
  );

  return (
    <>
      <IonList lines="full" className="max-w-xl">
        <h3 className="list-title">
          Habitats
          <InfoButtonPopover>
            <div className="font-light">
              This section shows you which broad habitat types are associated
              with the plant list you recorded. The associated UKHab code is
              provided below. Tap each habitat type to find out more information
              and to see typical plants associated with the habitat.
            </div>
          </InfoButtonPopover>
        </h3>
        <div className="rounded-list">
          <div className="list-divider">
            <div>Broad habitat</div>
            <div>Match</div>
          </div>

          {broadHabitats?.map(getHabitatItem)}

          {isLoading && getLoader()}
        </div>
      </IonList>

      <IonModal isOpen={!!showModal}>
        <ModalHeader
          title={showModal?.broadHabitat || ''}
          onClose={() => setShowModal(undefined)}
        />
        {showModal && <Habitat habitat={showModal} />}
      </IonModal>
    </>
  );
};

export default Habitats;
