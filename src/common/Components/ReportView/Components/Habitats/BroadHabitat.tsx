import { openOutline } from 'ionicons/icons';
import { IonItem, IonIcon } from '@ionic/react';
import { Badge, Main } from 'common/flumens';
import flowerIcon from 'common/images/flowerIcon.svg';
import { BroadHabitat } from 'common/services/habitats';
import InfoButtonPopover from 'Components/InfoButton';

type Props = { habitat: BroadHabitat };

const Habitat = ({ habitat }: Props) => {
  const getSpeciesItem = (species: BroadHabitat['typicalSpecies'][0]) => (
    <IonItem
      className="[--padding-start:0]"
      href={`https://plantatlas2020.org/atlas/${species.bsbiid}`}
      detailIcon={openOutline}
      detail
      key={species.bsbiid}
    >
      <div className="flex w-full flex-nowrap items-center gap-2 py-1.5 pl-2 pr-4">
        <div className="list-avatar relative">
          <img
            src={`https://atlasimages.bsbi.org/processed/${species.bsbiid}/${species.bsbiid}-${species.bsbiphotoindex}/${species.bsbiid}-${species.bsbiphotoindex}-192w.webp`}
            onError={(e: any) => (e.target.style.display = 'none')} // eslint-disable-line
            className="absolute h-full w-full object-cover"
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

  return (
    <Main>
      <div className="px-2">
        <h3 className="list-title">
          Match:
          <Badge className="mx-2 bg-white ring-neutral-500/20">{`${habitat.matchingCoefficient}%`}</Badge>
          <InfoButtonPopover className="p-0">
            <div className="font-light">
              This indicates how strongly your plant list is associated with the
              habitat type. The more plants you record within the associated
              habitat type the higher the percentage match.
            </div>
          </InfoButtonPopover>
        </h3>

        <h3 className="list-title">Description</h3>
        <div className="rounded-md bg-white p-4">{habitat.description}</div>

        <h3 className="list-title">Typical species</h3>
        <div className="rounded-list">
          {habitat.typicalSpecies.map(getSpeciesItem)}
        </div>
      </div>
    </Main>
  );
};

export default Habitat;
