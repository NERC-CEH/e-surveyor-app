import { observer } from 'mobx-react';
import { Link, useRouteMatch } from 'react-router-dom';
import { Main, MenuAttrItem, InfoMessage, Block } from '@flumens';
import { SeedmixSpecies } from 'common/data/seedmix';
import useHeaderScroll from 'common/helpers/useHeaderScroll';
import transectIcon from 'common/images/transectIconBlack.svg';
import appModel, { SeedMix } from 'common/models/app';
import Sample from 'models/sample';
import InfoButtonPopover from 'Components/InfoButton';
import LocationCard from 'Survey/Habitat/Free/Home/LocationCard';
import { yearSownAttr } from 'Survey/Habitat/Free/config';
import StarsBackground from 'Survey/common/Components/StarsBackground';
import {
  CUSTOM_SEEDMIX_GROUP_VALUE,
  customSeedmixAttr,
  seededAttr,
  SEEDMIX_ATTR_ID,
  seedmixAttr,
  seedmixGroupAttr,
} from 'Survey/common/config';
import squareIcon from './square.svg';
import stepsIcon from './steps.svg';

type Props = {
  sample: Sample;
  isDisabled?: boolean;
};

const MainComponent = ({ sample, isDisabled }: Props) => {
  const match = useRouteMatch();
  const mainProps = useHeaderScroll();

  const { type, quadratSize, steps } = sample.data;
  const { completedDetails } = sample.metadata;

  const recordAttrs = {
    record: sample.data,
    isDisabled: sample.isDisabled,
  };

  const isCustom =
    sample.data[seedmixGroupAttr.id] === CUSTOM_SEEDMIX_GROUP_VALUE;

  return (
    <Main {...mainProps} className="[--padding-bottom:100px]">
      <StarsBackground />

      <div className="list">
        <div className="card top p-0! overflow-hidden">
          <div className="list-divider justify-between p-2">
            <div>
              <span className="mr-2">1.</span> Site
            </div>
          </div>
          <LocationCard locationId={sample.data.locationId} />
        </div>

        <div className="rounded-list">
          <div className="list-divider justify-between p-2">
            <div>
              <span className="mr-2">2.</span> Survey
            </div>
          </div>
          <MenuAttrItem
            routerLink={`${match.url}/type`}
            value={type || ''}
            icon={transectIcon}
            label="Type"
            skipValueTranslation
            disabled={isDisabled || completedDetails}
            lines="full"
          />
          <MenuAttrItem
            routerLink={`${match.url}/steps`}
            value={steps || ''}
            icon={stepsIcon}
            label="Steps"
            skipValueTranslation
            disabled={isDisabled || !isCustom || completedDetails}
            lines="full"
          />
          {isDisabled ||
            (!isCustom && !!steps && (
              <InfoMessage inline>
                This is the number of times that you will stop and search for
                plants on your transect.
              </InfoMessage>
            ))}

          <MenuAttrItem
            routerLink={`${match.url}/quadratSize`}
            value={!!quadratSize && `${quadratSize}m`}
            icon={squareIcon}
            label="Quadrat size"
            skipValueTranslation
            disabled={isDisabled || !isCustom || completedDetails}
            lines="full"
          />
          {isDisabled ||
            (!isCustom && !!quadratSize && (
              <InfoMessage inline>
                This is the size of the area that you will search for plants in
                each step.
              </InfoMessage>
            ))}
        </div>

        <div className="rounded-list">
          <div className="list-divider justify-between p-2">
            <div>
              <span className="mr-2">3.</span> Seed mix (optional)
            </div>
            <InfoButtonPopover className="px-2">
              <div className="font-light">
                <b>Why ask about seed mix?</b>
                <div>
                  It helps us interpret your plant records and show you which
                  species may be expected to appear.
                </div>
              </div>
            </InfoButtonPopover>
          </div>

          <Block
            block={seededAttr}
            {...recordAttrs}
            onChange={(value: any) => {
              sample.data[seededAttr.id] = value;
              delete sample.data[seedmixGroupAttr.id];
              delete sample.data[SEEDMIX_ATTR_ID];
              delete sample.data[customSeedmixAttr.id];
              delete sample.data[yearSownAttr.id];
              return null;
            }}
          />
          <Block
            block={seedmixGroupAttr}
            {...recordAttrs}
            onChange={(value: any) => {
              sample.data[seedmixGroupAttr.id] = value;
              delete sample.data[SEEDMIX_ATTR_ID];
              delete sample.data[customSeedmixAttr.id];
              return null;
            }}
          />
          <Block
            block={seedmixAttr}
            {...recordAttrs}
            onChange={(value: any) => {
              sample.data[SEEDMIX_ATTR_ID] = value;
              delete sample.data[customSeedmixAttr.id];

              if (isCustom) {
                const byId = ({ id }: SeedMix): boolean => id === value;
                const selectedSeedmix = appModel.data.seedmixes.find(byId);

                sample.data[SEEDMIX_ATTR_ID] = selectedSeedmix?.name;

                const getWarehouseId = (sp: SeedmixSpecies) => sp.warehouseId;
                const species = (selectedSeedmix?.species || [])
                  .map(getWarehouseId)
                  .join(',');
                sample.data[customSeedmixAttr.id] = species;
              }
            }}
          />

          {sample.data[seedmixGroupAttr.id] === CUSTOM_SEEDMIX_GROUP_VALUE && (
            <InfoMessage inline>
              You can define your own seedmixes{' '}
              <Link to="/settings/seedmixes">here</Link>.
            </InfoMessage>
          )}

          <Block block={yearSownAttr} {...recordAttrs} />
        </div>
      </div>
    </Main>
  );
};

export default observer(MainComponent);
