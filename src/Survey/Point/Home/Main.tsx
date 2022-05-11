import { FC, useContext } from 'react';
import { observer } from 'mobx-react';
import Sample from 'models/sample';
import {
  IonItemDivider,
  IonIcon,
  IonList,
  NavContext,
  IonNote,
} from '@ionic/react';
import {
  Main,
  MenuAttrItem,
  LongPressButton,
  InfoMessage,
  InfoButton,
} from '@oldBit';
import {
  camera,
  bookmarkOutline,
  locationOutline,
  informationCircleOutline,
} from 'ionicons/icons';
import Seeds from 'common/images/seeds.svg';
import cameraButton from 'common/images/cameraButton.png';
import mapPicker from 'common/images/mapPicker.png';
import InfoButtonPopover from 'Components/InfoButton';
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
      <InfoMessage icon={informationCircleOutline}>
        How to complete a survey?
        <InfoButton label="READ MORE" header="Tips">
          <div>
            <p>
              Start by giving your survey a name (such as the name of the place
              you are surveying) and location. The app can pick up on your
              current location, but if you want to survey somewhere else, you
              can do this by clicking on the right arrow and using the map to
              choose your location.
            </p>
            <img src={mapPicker} />
            <p>
              Choose your seed supplier from the drop down menu, and then choose
              the name of your seed mix. This will allow the app to compare the
              plant species you sowed to the plants you see in the survey.
            </p>
            <p>You can now begin to add plants to your survey. </p>
            <img src={cameraButton} />
            <p>
              If you have identified the plants yourself, hold down the camera
              button and write the name of your plant species into the text box.
            </p>
            <p>
              If you would like the AI to identify your plants, tap on the
              camera button and take a photo of the plant you would like to
              identify. If the AI isn't sure what your plant is, it will put an
              [orange question mark] or [red cross] next to the photo and
              species name. You can tap to see images of different possible
              plant species, and choose which you think is correct by clicking
              "This is my plant".
            </p>
            <p> Click here to find out how to take an AI-friendly image. </p>
            <p>
              Keep going until you have a list of all of your plants, and then
              click the finish button in the top right corner to view your
              report.
            </p>
          </div>
        </InfoButton>
      </InfoMessage>

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
            value={name || ''}
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
            <InfoButtonPopover buttonProps={{ color: 'medium' }}>
              <IonNote>
                Choose your seed supplier from the drop down menu, and then
                choose the name of your seed mix. This will allow the app to
                compare the plant species you sowed to the plants you see in the
                survey.
              </IonNote>
            </InfoButtonPopover>
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
