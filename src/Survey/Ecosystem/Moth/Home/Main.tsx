import { useContext } from 'react';
import { observer } from 'mobx-react';
import { bookOutline, cameraOutline, openOutline } from 'ionicons/icons';
import { useRouteMatch } from 'react-router';
import {
  Main,
  MenuAttrItem,
  Button,
  MenuAttrItemFromModel,
  Select,
  Input,
  InfoMessage,
} from '@flumens';
import { IonList, IonIcon, NavContext } from '@ionic/react';
import SinglePhotoPicker from 'common/Components/PhotoPickers/SinglePhotoPicker';
import habitatIcon from 'common/images/habitats.svg';
import mothInsideBoxIcon from 'common/images/moth-inside-icon.svg';
import Occurrence from 'models/occurrence';
import Sample from 'models/sample';
import InfoBackgroundMessage from 'Components/InfoBackgroundMessage';
import GridRefValue from 'Survey/common/Components/GridRefValue';
import MenuDateAttr from 'Survey/common/Components/MenuDateAttr';
import SpeciesList from 'Survey/common/Components/SpeciesList';
import UploadedRecordInfoMessage from 'Survey/common/Components/UploadedRecordInfoMessage';
import { habitatValues } from '../config';

type Props = {
  sample: Sample;
  photoSelect: any;
  gallerySelect: any;
  isDisabled: boolean;
};

const HomeMain = ({
  sample,
  isDisabled,
  photoSelect,
  gallerySelect,
}: Props) => {
  const { url } = useRouteMatch();
  const { navigate } = useContext(NavContext);

  const hasSpecies = !!sample.occurrences.length;
  const isOtherHabitat = sample.data.habitat === 'Other (please specify)';

  const navigateToOccurrence = (model: Sample | Occurrence) => {
    if (isDisabled || !(model instanceof Occurrence)) return;

    navigate(`${url}/occurrence/${model.cid}`);
  };

  return (
    <Main className="pb-ion-25">
      <IonList lines="full" className="mb-2 flex flex-col gap-4">
        <div className="rounded-list my-2">
          {isDisabled && <UploadedRecordInfoMessage />}
        </div>

        <div className="rounded-list mb-3">
          <Button
            href="https://www.ceh.ac.uk/our-science/projects/farmer-led-moth-recording"
            prefix={<IonIcon icon={bookOutline} className="size-6" />}
            suffix={<IonIcon icon={openOutline} />}
            className="border-none text-left bg-white!"
          >
            Project information
          </Button>
        </div>

        <div className="rounded-list">
          <SinglePhotoPicker
            model={sample}
            label="Trap site photo"
            disabled={isDisabled}
          />

          <MenuAttrItem
            routerLink={`${url}/location`}
            icon={mothInsideBoxIcon}
            label="Location"
            skipValueTranslation
            value={<GridRefValue sample={sample} />}
            disabled={isDisabled}
          />
          <MenuDateAttr
            label="Date"
            isDisabled={isDisabled}
            value={sample.data.date}
            // eslint-disable-next-line no-return-assign
            onChange={(val: any) => (sample.data.date = val)}
          />
          {!sample.data.date && (
            <InfoMessage inline>
              If trapping overnight please enter the date for the evening on
              which the trap was put out.
            </InfoMessage>
          )}
          <Select
            options={habitatValues}
            onChange={(habitat: any) => (sample.data.habitat = habitat)} // eslint-disable-line
            value={sample.data.habitat}
            label="Habitat"
            prefix={<IonIcon src={habitatIcon} className="size-6" />}
            isDisabled={isDisabled}
          />
          {isOtherHabitat && (
            <Input
              label="Other habitat"
              prefix={<IonIcon src={habitatIcon} className="size-6" />}
              onChange={(habitat: any) => (sample.data.otherHabitat = habitat)} // eslint-disable-line
              value={sample.data.otherHabitat}
              isDisabled={isDisabled}
            />
          )}
          <MenuAttrItemFromModel
            model={sample}
            attr="comment"
            skipValueTranslation
            disabled={isDisabled}
          />
        </div>
      </IonList>

      {!isDisabled && (
        <Button
          color="secondary"
          prefix={<IonIcon src={cameraOutline} className="size-5" />}
          onPress={photoSelect}
          onLongPress={gallerySelect}
          className="bg-secondary-600 mx-auto mt-10 mb-5"
        >
          Add
        </Button>
      )}

      {!hasSpecies && (
        <InfoBackgroundMessage>
          Your species list is empty. <br /> tap the orange Add button take a
          photo of a moth for the AI to identify.
        </InfoBackgroundMessage>
      )}

      <SpeciesList
        occurrences={sample.occurrences}
        isDisabled={isDisabled}
        useDoughnut
        showPhoto
        showGallery={false}
        allowReidentify
        onOccurrenceClick={navigateToOccurrence}
        useNumberedList
      />

      {!isDisabled && hasSpecies && (
        <InfoBackgroundMessage name="showMothSpeciesListTip">
          Swipe left on a species to delete it. Tap the number to increase the
          count, and tap the species name to edit.
        </InfoBackgroundMessage>
      )}

      {!isDisabled && hasSpecies && (
        <InfoBackgroundMessage name="showWiFiSettingTip">
          To avoid uploading photos while using mobile data, you can disable
          this feature in the app settings.
        </InfoBackgroundMessage>
      )}
    </Main>
  );
};

export default observer(HomeMain);
