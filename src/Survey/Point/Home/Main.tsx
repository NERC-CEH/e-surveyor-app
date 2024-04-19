import { useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import 'ionicons/dist/svg/checkmark-circle-outline.svg';
import 'ionicons/dist/svg/close-circle-outline.svg';
import 'ionicons/dist/svg/help-circle-outline.svg';
import {
  addCircleOutline,
  bookmarkOutline,
  locationOutline,
} from 'ionicons/icons';
import {
  Main,
  MenuAttrItem,
  InfoMessage,
  InfoButton,
  Button,
  useAlert,
} from '@flumens';
import { IonIcon, IonList, NavContext } from '@ionic/react';
import InfoBackgroundMessage from 'common/Components/InfoBackgroundMessage';
import config from 'common/config';
import cameraButton from 'common/images/cameraButton.png';
import mapPicker from 'common/images/mapPicker.png';
import Seeds from 'common/images/seeds.svg';
import appModel from 'common/models/app';
import Sample from 'models/sample';
import InfoButtonPopover from 'Components/InfoButton';
import GridRefValue from 'Survey/common/Components/GridRefValue';
import SpeciesList from 'Survey/common/Components/SpeciesList';
import UploadedRecordInfoMessage from 'Survey/common/Components/UploadedRecordInfoMessage';

const { POSITIVE_THRESHOLD } = config;

interface MatchParams {
  url: string;
}

type Props = {
  sample: Sample;
  photoSelect: () => void;
  match: MatchParams;
  isDisabled: boolean;
};

const HomeMain = ({ sample, photoSelect, match, isDisabled }: Props) => {
  const alert = useAlert();
  const { navigate } = useContext(NavContext);

  const navigateToSearch = () => navigate(`${match.url}/taxon`);

  const getNewImageButton = () => {
    if (isDisabled) {
      return <br />;
    }

    return (
      <Button
        color="secondary"
        onLongPress={navigateToSearch}
        onPress={photoSelect}
        prefix={<IonIcon icon={addCircleOutline} className="size-6" />}
        className="mx-auto my-10"
      >
        Species
      </Button>
    );
  };

  const { seedmixgroup, seedmix, name } = sample.attrs;

  const prettyGridRef = <GridRefValue sample={sample} />;

  const baseURL = match.url;

  useEffect(() => {
    const hasSpeciesWithLowScore = (model: Sample) => {
      const [occ] = model.occurrences;
      const score = occ.getSpecies()?.score;
      if (
        score &&
        score < POSITIVE_THRESHOLD &&
        appModel.attrs.showFirstLowScorePhotoTip
      ) {
        alert({
          message:
            "The AI isn't sure about your photo, tap to check other possible species.",
          buttons: [{ text: 'OK' }],
        });
        appModel.attrs.showFirstLowScorePhotoTip = false;
      }
    };
    sample.samples.some(hasSpeciesWithLowScore);
  }, [sample.samples]);

  return (
    <Main className="[--padding-bottom:20px]">
      {!isDisabled && (
        <InfoMessage
          color="tertiary"
          className="m-2"
          suffix={
            <InfoButton color="dark" label="READ MORE" header="Tips">
              <div>
                <p>
                  Start by giving your survey a name (such as the name of the
                  place you are surveying) and location. The app can pick up on
                  your current location, but if you want to survey somewhere
                  else, you can do this by clicking on the right arrow and using
                  the map to choose your location.
                </p>
                <img src={mapPicker} />
                <p>
                  Choose your seed supplier from the drop down menu, and then
                  choose the name of your seed mix. This will allow the app to
                  compare the plant species you sowed to the plants you see in
                  the survey.
                </p>
                <p>You can now begin to add plants to your survey. </p>
                <img src={cameraButton} />
                <p>
                  If you have identified the plants yourself, hold down the
                  orange species button and write the name of your plant species
                  into the text box.
                </p>
                <p>
                  If you would like the AI to identify your plants, tap on the
                  camera button and take a photo of the plant you would like to
                  identify. If the AI isn't sure what your plant is, it will put
                  an [orange question mark] or [red cross] next to the photo and
                  species name. You can tap to see images of different possible
                  plant species, and choose which you think is correct by
                  clicking "This is my plant".
                </p>
                <p>Click here to find out how to take an AI-friendly image.</p>
                <p>
                  Keep going until you have a list of all of your plants, and
                  then click the finish button in the top right corner to view
                  your report.
                </p>
              </div>
            </InfoButton>
          }
        >
          How to complete a survey?
        </InfoMessage>
      )}

      {isDisabled && <UploadedRecordInfoMessage />}

      <IonList lines="full">
        <h3 className="list-title">Details</h3>
        <div className="rounded-list">
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

        <h3 className="list-title">
          Seed mix
          <InfoButtonPopover>
            <div className="font-light">
              Choose your seed supplier from the drop down menu, and then choose
              the name of your seed mix. This will allow the app to compare the
              plant species you sowed to the plants you see in the survey.
            </div>
          </InfoButtonPopover>
        </h3>
        <div className="rounded-list">
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

      <SpeciesList
        sample={sample}
        isDisabled={isDisabled}
        useSubSamples
        useSpeciesProfile
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
