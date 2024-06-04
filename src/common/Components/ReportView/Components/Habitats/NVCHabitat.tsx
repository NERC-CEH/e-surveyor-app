import { openOutline } from 'ionicons/icons';
import { IonItem, IonIcon } from '@ionic/react';
import ExpandableList from 'common/Components/ExpandableList';
import { Badge, Main } from 'common/flumens';
import flowerIcon from 'common/images/flowerIcon.svg';
import { NVCHabitat, TypicalSpecies } from 'common/services/habitats';

type Props = { habitats: NVCHabitat[] };

const Habitat = ({ habitats }: Props) => {
  const getSpeciesItem = (species: TypicalSpecies) => (
    <IonItem
      className="[--padding-start:0] last:[--border-style:none]"
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

  const getItem = (habitat: NVCHabitat) => {
    const typicalSpecies = Array.isArray(habitat.typicalSpecies)
      ? habitat.typicalSpecies
      : [];

    return (
      <div className="m-2 mb-4 rounded-md bg-white" key={habitat.NVCHabitat}>
        <div className="flex items-center justify-between p-2">
          <div className="text-lg font-bold">{habitat.NVCHabitat}</div>
          <Badge>{`${habitat.similarityScore}`}</Badge>
        </div>
        <div className="my-3 p-2">{habitat.fullName || 'No description'}</div>
        <ExpandableList maxItems={2}>
          {typicalSpecies.map(getSpeciesItem)}
        </ExpandableList>
      </div>
    );
  };
  return <Main>{habitats.map(getItem)}</Main>;
};

export default Habitat;
