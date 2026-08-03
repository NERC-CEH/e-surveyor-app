import { useState } from 'react';
import { IonItem, IonModal } from '@ionic/react';
import { Main, ModalHeader } from 'common/flumens';
import { NVCHabitat } from '../service';
import NVCHabitatMain from './NVCHabitat';

type Props = { habitats: NVCHabitat[] };

const NVCHabitats = ({ habitats }: Props) => {
  const [showNVCModal, setShowNVCModal] = useState<NVCHabitat>();

  const getHabitatItem = (habitat: NVCHabitat) => (
    <IonItem
      key={habitat.NVCHabitat}
      onClick={() => setShowNVCModal(habitat)}
      lines="full"
    >
      <div className="flex w-full items-center justify-between gap-2 py-2">
        <div className="flex flex-col">
          <div className="line-clamp-2 font-semibold text-black/85">
            {habitat.NVCHabitat}
          </div>
          <div className="line-clamp-1 text-sm opacity-80">
            {habitat.fullName}
          </div>
        </div>
        <div className="text-[var(--form-value-color)]">
          {habitat.similarityScore.toFixed(3)}
        </div>
      </div>
    </IonItem>
  );

  return (
    <Main>
      <div className="list">
        <div className="overflow-hidden rounded-md">
          <div className="list-divider">
            <div>NVC types</div>
            <div>Score</div>
          </div>

          {habitats?.map(getHabitatItem) || []}
        </div>
      </div>

      <IonModal isOpen={!!showNVCModal}>
        <ModalHeader
          title={showNVCModal?.NVCHabitat || ''}
          onClose={() => setShowNVCModal(undefined)}
        />
        {showNVCModal && <NVCHabitatMain habitat={showNVCModal} />}
      </IonModal>
    </Main>
  );
};

export default NVCHabitats;
