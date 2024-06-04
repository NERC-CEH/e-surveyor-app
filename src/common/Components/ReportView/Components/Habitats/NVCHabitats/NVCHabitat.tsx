import { openOutline } from 'ionicons/icons';
import { IonItem, IonIcon } from '@ionic/react';
import { Badge, Main } from 'common/flumens';
import flowerIcon from 'common/images/flowerIcon.svg';
import { NVCHabitat, TypicalSpecies } from 'common/services/habitats';
import InfoButtonPopover from 'Components/InfoButton';

type Props = { habitat: NVCHabitat };

const NVCHabitatMain = ({ habitat }: Props) => {
  const getSpeciesItem = (species: TypicalSpecies) => (
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

  const typicalSpecies = Array.isArray(habitat.typicalSpecies)
    ? habitat.typicalSpecies
    : [];

  return (
    <Main>
      <div className="my-2 px-2">
        <div className="rounded-md bg-white p-4">{habitat.fullName}</div>

        <h3 className="list-title">
          Score:
          <Badge className="mx-2 bg-white ring-neutral-500/20">
            {habitat.similarityScore.toFixed(3)}
          </Badge>
          <InfoButtonPopover className="p-0">
            <div className="font-light">
              This is a similarity score between the NVC community type and your
              plant list. Whilst the value itself is not important to interpret,
              the relative similarity and the rank alongside other NVC community
              types can indicate which type your plant list has a greater
              association with.
            </div>
          </InfoButtonPopover>
        </h3>

        <h3 className="list-title">Constant species</h3>
        <div className="rounded-list">{typicalSpecies.map(getSpeciesItem)}</div>
      </div>
    </Main>
  );
};

export default NVCHabitatMain;
