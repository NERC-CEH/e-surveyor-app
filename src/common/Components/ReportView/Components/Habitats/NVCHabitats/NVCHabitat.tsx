import { Badge, Main } from 'common/flumens';
import { NVCHabitat } from 'common/services/habitats';
import InfoButtonPopover from 'Components/InfoButton';
import TypicalSpecies from '../TypicalSpecies';

type Props = { habitat: NVCHabitat };

const NVCHabitatMain = ({ habitat }: Props) => {
  const typicalSpecies = Array.isArray(habitat.typicalSpecies)
    ? habitat.typicalSpecies
    : [];

  return (
    <Main>
      <div className="my-2 px-2">
        <div className="rounded-md bg-white p-4">
          {habitat.fullName || 'No description'}
        </div>

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

        {!!typicalSpecies.length && (
          <>
            <h3 className="list-title">Constant species</h3>
            <div className="rounded-list">
              {typicalSpecies.map(species => (
                <TypicalSpecies species={species} key={species.bsbiid} />
              ))}
            </div>
          </>
        )}
      </div>
    </Main>
  );
};

export default NVCHabitatMain;
