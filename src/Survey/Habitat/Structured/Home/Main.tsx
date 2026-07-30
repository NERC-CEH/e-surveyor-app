import { observer } from 'mobx-react';
import { ellipsisHorizontalOutline } from 'ionicons/icons';
import { Link, useRouteMatch } from 'react-router-dom';
import { Main, MenuAttrItem, InfoMessage, Block } from '@flumens';
import { SeedmixSpecies } from 'common/data/seedmix';
import useHeaderScroll from 'common/helpers/useHeaderScroll';
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
import {
  COMMON_STANDARDS_PROTOCOL_VALUE,
  CUSTOM_PROTOCOL_VALUE,
  PLACEMENT_RANDOM_VALUE,
  quadratPlacementAttr,
  quadratSizeAttr,
  surveyProtocolAttr,
  transectLengthAttr,
} from '../config';

type Props = {
  sample: Sample;
  isDisabled?: boolean;
};

const MainComponent = ({ sample, isDisabled }: Props) => {
  const match = useRouteMatch();
  const mainProps = useHeaderScroll();

  const { quadrats } = sample.data;
  const { completedDetails } = sample.metadata;

  const recordAttrs = {
    record: sample.data,
    isDisabled: sample.isDisabled,
  };

  const protocol = sample.data[surveyProtocolAttr.id];
  const isCustom = sample.data[surveyProtocolAttr.id] === CUSTOM_PROTOCOL_VALUE;

  const isCustomSeedmix =
    sample.data[seedmixGroupAttr.id] === CUSTOM_SEEDMIX_GROUP_VALUE;

  return (
    <Main {...mainProps} className="pb-ion-25">
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

          <Block
            block={surveyProtocolAttr}
            record={sample.data}
            isDisabled={isDisabled || completedDetails}
            onChange={(value: any) => {
              sample.data[surveyProtocolAttr.id] = value;
              sample.data.quadrats = 10;
              sample.data[quadratSizeAttr.id] = 1;
              sample.data[transectLengthAttr.id] = 100;
              sample.data[quadratPlacementAttr.id] = PLACEMENT_RANDOM_VALUE;

              if (
                value === COMMON_STANDARDS_PROTOCOL_VALUE &&
                !appModel.data.use10stepsForCommonStandard
              ) {
                sample.data.quadrats = 20;
              }
            }}
          />
          <InfoMessage inline>
            Use a recommended survey setup or pick a custom one.
          </InfoMessage>
          {!!protocol && (
            <>
              <MenuAttrItem
                routerLink={`${match.url}/quadrats`}
                value={quadrats || ''}
                icon={ellipsisHorizontalOutline}
                label="Number of quadrats"
                skipValueTranslation
                disabled={isDisabled || !isCustom || completedDetails}
                lines="full"
              />

              <InfoMessage inline>
                This is the number of times that you will stop and search for
                plants on your transect.
              </InfoMessage>

              <Block
                block={quadratSizeAttr}
                record={sample.data}
                isDisabled={isDisabled || !isCustom || completedDetails}
              />
              <InfoMessage inline>
                This is the size of the area that you will search for plants in
                each step.
              </InfoMessage>

              <Block
                block={transectLengthAttr}
                record={sample.data}
                isDisabled={isDisabled || !isCustom || completedDetails}
              />

              <Block
                block={quadratPlacementAttr}
                record={sample.data}
                isDisabled={isDisabled || !isCustom || completedDetails}
              />
            </>
          )}
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

              if (isCustomSeedmix) {
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
