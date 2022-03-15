import React, { FC, useContext } from 'react';
import { observer } from 'mobx-react';
import Sample from 'models/sample';
import {
  IonItemDivider,
  IonIcon,
  IonList,
  NavContext,
  IonNote,
} from '@ionic/react';
import { Main, MenuAttrItem, LongPressButton, InfoMessage } from '@flumens';
import {
  camera,
  bookmarkOutline,
  locationOutline,
  informationCircleOutline,
} from 'ionicons/icons';
import Seeds from 'common/images/seeds.svg';
import InfoButton from 'Components/InfoButton';
import GridRefValue from 'Survey/common/Components/GridRefValue';
import SpeciesList from 'Survey/common/Components/SpeciesList';
import 'ionicons/dist/svg/checkmark-circle-outline.svg';
import 'ionicons/dist/svg/help-circle-outline.svg';
import 'ionicons/dist/svg/close-circle-outline.svg';

interface MatchParams {
  url: string;
}

type Props = {
  sample: Sample;
  photoSelect: () => void;
  match: MatchParams;
  isDisabled: boolean;
};

const HomeMain: FC<Props> = ({ sample, photoSelect, match, isDisabled }) => {
  const { navigate } = useContext(NavContext);

  const navigateToSearch = () => navigate(`${match.url}/taxon`);

  const getNewImageButton = () => {
    if (isDisabled) {
      return <br />;
    }

    return (
      <LongPressButton
        color="secondary"
        onLongClick={navigateToSearch}
        type="submit"
        expand="block"
        onClick={photoSelect}
      >
        <IonIcon slot="start" icon={camera} size="large" />
        Plant
      </LongPressButton>
    );
  };

  const { seedmixgroup, seedmix, name } = sample.attrs;

  const prettyGridRef = <GridRefValue sample={sample} />;

  const baseURL = match.url;

  return (
    <Main>
      <IonList lines="full">
        {isDisabled && (
          <InfoMessage icon={informationCircleOutline}>
            This survey has been finished and cannot be updated.
          </InfoMessage>
        )}

        <IonItemDivider>Details</IonItemDivider>
        <div className="rounded">
          <MenuAttrItem
            routerLink={`${baseURL}/name`}
            icon={bookmarkOutline}
            label="Name"
            value={name}
            disabled={isDisabled}
          />

          <MenuAttrItem
            routerLink={`${baseURL}/map`}
            value={prettyGridRef}
            icon={locationOutline}
            label="Location"
            skipValueTranslation
            disabled={isDisabled}
          />
        </div>

        <IonItemDivider>
          <div>
            Seed mix
            <InfoButton buttonProps={{ color: 'medium' }}>
              <IonNote>
                Choose your seed supplier from the drop down menu, and then
                choose the name of your seed mix. This will allow the app to
                compare the plant species you sowed to the plants you see in the
                survey.
              </IonNote>
            </InfoButton>
          </div>
        </IonItemDivider>
        <div className="rounded">
          <MenuAttrItem
            routerLink={`${baseURL}/seedmixgroup`}
            icon={Seeds}
            label="Supplier"
            value={seedmixgroup || ''}
            disabled={isDisabled}
          />

          <MenuAttrItem
            routerLink={`${baseURL}/seedmix`}
            icon={Seeds}
            label="Mix"
            value={seedmix || ''}
            // styles="opacity:0.8"
            disabled={!seedmixgroup || isDisabled}
          />
        </div>
      </IonList>

      {getNewImageButton()}

      <SpeciesList sample={sample} isDisabled={isDisabled} />
    </Main>
  );
};

export default observer(HomeMain);
