import { useState } from 'react';
import { openOutline } from 'ionicons/icons';
import { IonItem, IonIcon } from '@ionic/react';
import FullScreenPhotoViewer from 'common/Components/FullScreenPhotoViewer';
import flowerIcon from 'common/images/flowerIcon.svg';
import { TypicalSpecies } from 'common/services/habitats';

type Props = { species: TypicalSpecies };

const TypicalSpeciesItem = ({ species }: Props) => {
  const [showGallery, setShowGallery] = useState<number>();

  return (
    <IonItem
      className="[--padding-start:0]"
      href={`https://plantatlas2020.org/atlas/${species.bsbiid}`}
      detailIcon={openOutline}
      detail
    >
      <div className="flex w-full flex-nowrap items-center gap-2 py-1.5 pl-2 pr-4">
        <div className="list-avatar relative">
          <FullScreenPhotoViewer
            showGallery={showGallery}
            onClose={() => setShowGallery(undefined)}
            photos={[
              [
                `https://atlasimages.bsbi.org/processed/${species.bsbiid}/${species.bsbiid}-${species.bsbiphotoindex}/${species.bsbiid}-${species.bsbiphotoindex}-1920w.webp`,
                'Rob Still/Chris Gibson',
              ],
            ]}
          />
          <img
            src={`https://atlasimages.bsbi.org/processed/${species.bsbiid}/${species.bsbiid}-${species.bsbiphotoindex}/${species.bsbiid}-${species.bsbiphotoindex}-192w.webp`}
            onError={(e: any) => (e.target.style.display = 'none')} // eslint-disable-line
            onClick={(e: any) => {
              e.preventDefault();
              e.stopPropagation();
              setShowGallery(1);
            }}
            className="absolute z-10 h-full w-full object-cover"
          />
          <IonIcon src={flowerIcon} className="size-6 opacity-40" />
        </div>
        <div className="flex w-full flex-col">
          <div className="line-clamp-1 font-semibold">{species.commonName}</div>
          <div className="line-clamp-1 italic opacity-80">
            {species.scientificName}
          </div>
        </div>
      </div>
    </IonItem>
  );
};

export default TypicalSpeciesItem;
