import { useContext } from 'react';
import { observer } from 'mobx-react';
import { addCircleOutline, locationOutline } from 'ionicons/icons';
import { useRouteMatch } from 'react-router';
import { Main, MenuAttrItem, Button, Block } from '@flumens';
import { IonIcon, NavContext } from '@ionic/react';
import InfoBackgroundMessage from 'common/Components/InfoBackgroundMessage';
import { useDisableSwipeBack } from 'common/helpers/hooks';
import Sample from 'models/sample';
import InfoButtonPopover from 'Components/InfoButton';
import PhotoPicker from 'Components/PhotoPickers/PhotoPicker';
import GridRefValue from 'Survey/common/Components/GridRefValue';
import SpeciesList from 'Survey/common/Components/SpeciesList';
import {
  bareGroundAttr,
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

  return (
    <Main className="pb-ion-main">
      <div className="flex flex-col gap-4 m-3">
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
          <div className="list-divider">Quadrat photo</div>
          <PhotoPicker model={subSample} allowToCrop />
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
          <div className="[&>_.group]:border-x-0! [&>_.group]:border-t-0! [&>_.group]:rounded-none! my-2 [&>div>div>div>label]:text-sm! [&>div>div>div>label]:font-semibold! flex flex-col gap-1">
            <Block block={vegetationCompAttr} {...recordAttrs} />
            <Block block={bareGroundAttr} {...recordAttrs} />
            <Block block={litterThatchAttr} {...recordAttrs} />
            <Block block={mossLiverwortAttr} {...recordAttrs} />
            <Block block={deadWoodAttr} {...recordAttrs} />
            <Block block={standingWaterAttr} {...recordAttrs} />
            <div className="w-full flex justify-between px-4 font-bold">
              <span>TOTAL:</span> <span>{totalComposition} %</span>
            </div>
          </div>
        </div>
      </div>

      {getNewImageButton()}

      <SpeciesList
        sample={subSample}
        isDisabled={isDisabled}
        useSpeciesProfile
        useSubSamples
        showPhoto
      />

      {!subSample.samples.length && (
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
