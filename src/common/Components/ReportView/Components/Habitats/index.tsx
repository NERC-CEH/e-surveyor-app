import { useEffect, useState } from 'react';
import { Button, InfoBackgroundMessage, ModalHeader } from '@flumens';
import { device, useAlert, useToast } from '@flumens/ionic/dist';
import { IonItem, IonList, IonModal, IonSkeletonText } from '@ionic/react';
import ExpandableList from 'common/Components/ExpandableList';
import {
  identifyBroad,
  identifyNVC,
  BroadHabitat,
  NVCHabitat,
} from 'common/services/habitats';
import InfoButtonPopover from 'Components/InfoButton';
import { SpeciesNames } from '../../helpers';
import BroadHabitatMain from './BroadHabitat';
import NVCHabitatsMain from './NVCHabitats';

type Props = {
  uniqueSpecies: SpeciesNames[];
};

const useNVCAlert = () => {
  const toast = useToast();
  const alert = useAlert();

  const showAlert = () =>
    new Promise(resolve => {
      alert({
        header: 'NVC',
        skipTranslation: true,
        message:
          'Have you collected an exhaustive plant list for your survey area?',
        buttons: [
          {
            text: 'No',
            handler() {
              resolve(false);
              toast.warn('Please add more plants to your survey.');
            },
            role: 'cancel',
          },
          {
            text: 'Yes',
            handler() {
              resolve(true);
            },
          },
        ],
      });
    });

  return showAlert;
};

const Habitats = ({ uniqueSpecies }: Props) => {
  const [showBroadModal, setShowBroadModal] = useState<BroadHabitat>();
  const [showNVCModal, setShowNVCModal] = useState<boolean>();
  const showNVCAlert = useNVCAlert();

  const [isLoading, setIsLoading] = useState(false);
  const [broadHabitats, setBroadHabitats] = useState<BroadHabitat[]>();
  const [nvcHabitats, setNVCHabitats] = useState<NVCHabitat[]>();

  const navigateToNVC = async () => {
    const proceed = await showNVCAlert();
    if (!proceed) return;
    setShowNVCModal(true);
  };

  const refreshHabitats = () => {
    (async () => {
      if (!device.isOnline) return;

      if (uniqueSpecies.length <= 1) return; // 0-1 species results in 500 response from the service

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
    <IonItem key={habitat.UKHab} onClick={() => setShowBroadModal(habitat)}>
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
          {habitat.matchingCoefficient.toFixed(0)}%
        </div>
      </div>
    </IonItem>
  );

  return (
    <>
      <IonList lines="full" className="w-full max-w-2xl">
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
        <div className="overflow-hidden rounded-md">
          <div className="list-divider">
            <div>Broad habitats</div>
            <div>Match</div>
          </div>

          <ExpandableList maxItems={2}>
            {broadHabitats?.map(getHabitatItem) || []}
          </ExpandableList>

          {isLoading && getLoader()}
        </div>

        {!isLoading && (
          <div className="mx-auto mb-3 mt-6 flex w-fit items-center gap-4">
            <Button onPress={navigateToNVC}>NVC types</Button>
            <InfoButtonPopover className="p-0">
              <div className="font-light">
                This option shows you which National Vegetation Classification
                (NVC) types are associated with the plant list you recorded.
                This is a more detailed habitat classification, so a full
                exhaustive plant list must be recorded before these results are
                presented.
              </div>
            </InfoButtonPopover>
          </div>
        )}
      </IonList>
      <IonModal isOpen={!!showBroadModal}>
        <ModalHeader
          title={showBroadModal?.broadHabitat || ''}
          onClose={() => setShowBroadModal(undefined)}
        />
        {showBroadModal && <BroadHabitatMain habitat={showBroadModal} />}
      </IonModal>

      <IonModal isOpen={!!showNVCModal}>
        <ModalHeader title="NVC types" onClose={() => setShowNVCModal(false)} />
        {nvcHabitats && <NVCHabitatsMain habitats={nvcHabitats} />}
      </IonModal>
    </>
  );
};

export default Habitats;
