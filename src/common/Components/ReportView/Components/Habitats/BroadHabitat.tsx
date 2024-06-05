import { Badge, Main } from 'common/flumens';
import { BroadHabitat } from 'common/services/habitats';
import InfoButtonPopover from 'Components/InfoButton';
import TypicalSpecies from './TypicalSpecies';

type Props = { habitat: BroadHabitat };

const Habitat = ({ habitat }: Props) => {
  return (
    <Main>
      <div className="px-2">
        <div className="rounded-md bg-white p-4">{habitat.description}</div>

        <h3 className="list-title">
          Match:
          <Badge className="mx-2 bg-white ring-neutral-500/20">{`${habitat.matchingCoefficient.toFixed(
            0
          )}%`}</Badge>
          <InfoButtonPopover className="p-0">
            <div className="font-light">
              This indicates how strongly your plant list is associated with the
              habitat type. The more plants you record within the associated
              habitat type the higher the percentage match.
            </div>
          </InfoButtonPopover>
        </h3>

        <h3 className="list-title">Typical species</h3>
        <div className="rounded-list">
          {habitat.typicalSpecies.map(species => (
            <TypicalSpecies species={species} key={species.bsbiid} />
          ))}
        </div>
      </div>
    </Main>
  );
};

export default Habitat;
