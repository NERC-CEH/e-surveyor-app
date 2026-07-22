import { useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import { addCircleOutline } from 'ionicons/icons';
import { Link } from 'react-router-dom';
import { Main, InfoMessage, Button, useAlert, Block } from '@flumens';
import { IonIcon, NavContext } from '@ionic/react';
import InfoBackgroundMessage from 'common/Components/InfoBackgroundMessage';
import config from 'common/config';
import { SeedmixSpecies } from 'common/data/seedmix';
import appModel, { SeedMix } from 'common/models/app';
import Sample from 'models/sample';
import useHeaderScroll from 'helpers/useHeaderScroll';
import InfoButtonPopover from 'Components/InfoButton';
import SpeciesList from 'Survey/common/Components/SpeciesList';
import StarsBackground from 'Survey/common/Components/StarsBackground';
import UploadedRecordInfoMessage from 'Survey/common/Components/UploadedRecordInfoMessage';
import {
  CUSTOM_SEEDMIX_GROUP_VALUE,
  customSeedmixAttr,
  SEEDMIX_ATTR_ID,
  seedmixAttr,
} from 'Survey/common/config';
import { seededAttr, seedmixGroupAttr, yearSownAttr } from '../config';

const { positiveThreshold } = config;

type MatchParams = {
  url: string;
};

type Props = {
  sample: Sample;
  photoSelect: () => void;
  match: MatchParams;
  isDisabled: boolean;
};

const HomeMain = ({ sample, photoSelect, match, isDisabled }: Props) => {
  const alert = useAlert();
  const { navigate } = useContext(NavContext);
  const mainProps = useHeaderScroll();

  const navigateToSearch = () => navigate(`${match.url}/taxon`);

  useEffect(() => {
    const hasSpeciesWithLowScore = (model: Sample) => {
      const [occ] = model.occurrences;
      const score = occ.getSpecies()?.probability;
      if (
        score &&
        score < positiveThreshold &&
        appModel.data.showFirstLowScorePhotoTip
      ) {
        alert({
          message:
            "The AI isn't sure about your photo, tap to check other possible species.",
          buttons: [{ text: 'OK' }],
        });
        appModel.data.showFirstLowScorePhotoTip = false;
      }
    };
    sample.samples.some(hasSpeciesWithLowScore);
  }, [sample.samples]);

  const recordAttrs = {
    record: sample.data,
    isDisabled: sample.isDisabled,
  };

  return (
    <Main {...mainProps} className="[--padding-bottom:100px]">
      <StarsBackground>
        {isDisabled && <UploadedRecordInfoMessage />}

        {!isDisabled && (
          <div className="px-3">
            <b>Free Sampling</b>
            <div>
              Explore freely and record any plants you find. There's no set
              route or quadrats - just record what you see.
            </div>
          </div>
        )}
      </StarsBackground>

      <div className="list">
        <div className="card top">
          <div className="list-title">
            Seed mix (optional)
            <InfoButtonPopover>
              <div className="font-light">
                <b>Why ask about seed mix?</b>
                <div>
                  It helps us interpret your plant records and show you which
                  species may be expected to appear.
                </div>
              </div>
            </InfoButtonPopover>
          </div>

          <div className="rounded-list">
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

                const isCustom =
                  sample.data[seedmixGroupAttr.id] ===
                  CUSTOM_SEEDMIX_GROUP_VALUE;
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

            {sample.data[seedmixGroupAttr.id] ===
              CUSTOM_SEEDMIX_GROUP_VALUE && (
              <InfoMessage inline>
                You can define your own seedmixes{' '}
                <Link to="/settings/seedmixes">here</Link>.
              </InfoMessage>
            )}

            <Block block={yearSownAttr} {...recordAttrs} />
          </div>
        </div>
      </div>

      {!isDisabled ? (
        <Button
          color="secondary"
          onLongPress={navigateToSearch}
          onPress={photoSelect}
          prefix={<IonIcon icon={addCircleOutline} className="size-6" />}
          className="mx-auto mt-7 mb-3 bg-secondary-600"
        >
          Species
        </Button>
      ) : (
        <br />
      )}

      <SpeciesList
        sample={sample}
        isDisabled={isDisabled}
        useSubSamples
        useSpeciesProfile
        showPhoto
      />

      {!sample.samples.length && (
        <InfoBackgroundMessage>
          Your species list is empty. <br /> Hold down the orange species button
          to list plant species yourself, or tap to take a photo for the AI to
          identify.
        </InfoBackgroundMessage>
      )}
    </Main>
  );
};

export default observer(HomeMain);
