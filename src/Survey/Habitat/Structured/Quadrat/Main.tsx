import { useContext } from 'react';
import { observer } from 'mobx-react';
import clsx from 'clsx';
import {
  addCircleOutline,
  informationCircleOutline,
  locationOutline,
} from 'ionicons/icons';
import { useRouteMatch } from 'react-router';
import {
  Main,
  MenuAttrItem,
  Button,
  Block,
  InfoMessage,
  updateModelLocation,
} from '@flumens';
import { IonIcon, NavContext } from '@ionic/react';
import CircleIcon from 'common/Components/CircleIcon';
import InfoBackgroundMessage from 'common/Components/InfoBackgroundMessage';
import { useDisableSwipeBack } from 'common/helpers/hooks';
import useHeaderScroll from 'common/helpers/useHeaderScroll';
import Occurrence from 'models/occurrence';
import Sample from 'models/sample';
import InfoButtonPopover from 'Components/InfoButton';
import PhotoPicker from 'Components/PhotoPickers/PhotoPicker';
import GridRefValue from 'Survey/common/Components/GridRefValue';
import SpeciesList from 'Survey/common/Components/SpeciesList';
import StarsBackground from 'Survey/common/Components/StarsBackground';
import {
  bareGroundAttr,
  countAttr,
  coverAttr,
  deadWoodAttr,
  litterThatchAttr,
  mossLiverwortAttr,
  standingWaterAttr,
  vegetationCompAttr,
} from '../config';
import './styles.scss';

type Props = {
  subSample: Sample;
  photoSelect: () => void;
  isDisabled: boolean;
};

const QuadratMain = ({ subSample, photoSelect, isDisabled }: Props) => {
  const { navigate } = useContext(NavContext);
  const { url } = useRouteMatch();
  const mainProps = useHeaderScroll();

  useDisableSwipeBack();

  const navigateToSearch = () => navigate(`${url}/taxon`);

  const getNewImageButton = () => {
    if (isDisabled) return null;

    return (
      <Button
        color="secondary"
        onLongPress={navigateToSearch}
        onPress={photoSelect}
        prefix={<IonIcon icon={addCircleOutline} className="size-6" />}
        className="bg-secondary-600 mx-auto my-5"
      >
        Species
      </Button>
    );
  };

  const prettyGridRef = <GridRefValue sample={subSample} />;

  const recordAttrs = {
    record: subSample.data,
    isDisabled: subSample.isDisabled,
  };

  const totalComposition =
    (subSample.data[vegetationCompAttr.id] || 0) +
    (subSample.data[bareGroundAttr.id] || 0) +
    (subSample.data[litterThatchAttr.id] || 0) +
    (subSample.data[mossLiverwortAttr.id] || 0) +
    (subSample.data[deadWoodAttr.id] || 0) +
    (subSample.data[standingWaterAttr.id] || 0);

  const sliderClasses =
    'mx-5 mt-1 text-sm font-semibold w-full flex items-center justify-start gap-2';

  const selectedClasses =
    'bg-secondary-100/20 shadow-[inset_2px_0_0_0_color-mix(in_srgb,var(--color-secondary-900)_20%,transparent)]';
  const isSelected = (block: any) => subSample.data[block.id] > 0;

  const hasSpecies = !!subSample.occurrences.length;

  const speciesEntryClasses =
    'bg-ion-secondary-100/20 shadow-[inset_2px_0_0_0_color-mix(in_srgb,var(--color-secondary-900)_20%,transparent)]';

  const getItemClassName = (occ: Occurrence) => {
    const data = occ.data as any;
    const hasCover = (data[coverAttr.id] || 0) > 0;
    const hasCount = (data[countAttr.id] || 0) > 1;
    return hasCover || hasCount ? speciesEntryClasses : '';
  };

  return (
    <Main {...mainProps} className="pb-ion-10">
      <StarsBackground />
      <div className="list">
        <div className="card top p-0! overflow-hidden">
          <div className="list-divider">Quadrat photo</div>
          <PhotoPicker
            model={subSample}
            allowToCrop
            onChange={() => {
              // trigger GPS on the first photo added to the quadrat
              const isFirstPhoto = subSample.media.length === 1;
              if (!isFirstPhoto) return;
              subSample.startGPS(loc => updateModelLocation(subSample, loc));
            }}
          />
        </div>

        <div className="rounded-list">
          <MenuAttrItem
            routerLink={`${url}/map`}
            value={prettyGridRef}
            icon={locationOutline}
            label="Location"
            skipValueTranslation
            disabled={isDisabled}
            className="border-ion-none"
          />
        </div>

        <div className="rounded-list">
          <div className="list-divider">
            <span>Quadrat composition</span>

            <InfoButtonPopover className="px-2">
              <div className="font-light">
                Estimate how much of the quadrat is covered by each feature.
                Adjust the sliders accordingly.
              </div>
            </InfoButtonPopover>
          </div>
          <div className="[&>*>_.group]:border-x-0! [&>*>_.group]:bg-transparent [&>*>_.group]:border-t-0! [&>*>_.group]:rounded-none! flex flex-col">
            <div
              className={clsx(
                isSelected(vegetationCompAttr) && selectedClasses
              )}
            >
              <div className={sliderClasses}>
                <CircleIcon size={10} className="fill-green-800" /> Vegetation
                (live plants)
              </div>
              <Block block={vegetationCompAttr} {...recordAttrs} />
            </div>

            <div
              className={clsx(isSelected(bareGroundAttr) && selectedClasses)}
            >
              <div className={sliderClasses}>
                <CircleIcon size={10} className="fill-yellow-800" /> Bare ground
              </div>
              <Block block={bareGroundAttr} {...recordAttrs} />
            </div>

            <div
              className={clsx(isSelected(litterThatchAttr) && selectedClasses)}
            >
              <div className={sliderClasses}>
                <CircleIcon size={10} className="fill-neutral-800" /> Litter /
                thatch
              </div>
              <Block block={litterThatchAttr} {...recordAttrs} />
            </div>

            <div
              className={clsx(isSelected(mossLiverwortAttr) && selectedClasses)}
            >
              <div className={sliderClasses}>
                <CircleIcon size={10} className="fill-lime-600" /> Moss /
                liverwort
              </div>
              <Block block={mossLiverwortAttr} {...recordAttrs} />
            </div>

            <div className={clsx(isSelected(deadWoodAttr) && selectedClasses)}>
              <div className={sliderClasses}>
                <CircleIcon size={10} className="fill-neutral-500" /> Dead wood
              </div>
              <Block block={deadWoodAttr} {...recordAttrs} />
            </div>

            <div
              className={clsx(isSelected(standingWaterAttr) && selectedClasses)}
            >
              <div className={sliderClasses}>
                <CircleIcon size={10} className="fill-sky-600" /> Standing water
              </div>
              <Block block={standingWaterAttr} {...recordAttrs} />
            </div>

            <div className="w-full flex justify-between px-4 py-2 font-bold">
              <span>TOTAL:</span> <span>{totalComposition} %</span>
            </div>
          </div>
        </div>
      </div>

      {getNewImageButton()}

      <SpeciesList
        occurrences={subSample.occurrences}
        isDisabled={isDisabled}
        useSpeciesProfile
        showPhoto
        getItemClassName={getItemClassName}
      >
        {hasSpecies && !subSample.isDisabled && (
          <InfoMessage
            color="secondary"
            prefix={
              <IonIcon icon={informationCircleOutline} className="size-6" />
            }
          >
            Keep recording to capture all the plants you see.
          </InfoMessage>
        )}
      </SpeciesList>

      {!hasSpecies && (
        <InfoBackgroundMessage>
          Your species list is empty. <br /> Hold down the orange species button
          to list plant species yourself, or tap to take a photo for the AI to
          identify.
        </InfoBackgroundMessage>
      )}
    </Main>
  );
};

export default observer(QuadratMain);
