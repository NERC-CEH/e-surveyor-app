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
} from '@flumens';
import { IonList, IonIcon } from '@ionic/react';
import SinglePhotoPicker from 'common/Components/PhotoPickers/SinglePhotoPicker';
import habitatIcon from 'common/images/habitats.svg';
import mothInsideBoxIcon from 'common/images/moth-inside-icon.svg';
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

  const hasSpecies = !!sample.occurrences.length;
  const isOtherHabitat = sample.attrs.habitat === 'Other (please specify)';

  return (
    <Main>
      <IonList lines="full" className="mb-2 flex flex-col gap-4">
        <div className="rounded-list">
          {isDisabled && <UploadedRecordInfoMessage />}
        </div>

        <div className="rounded-list">
          <Button
            href="https://www.ceh.ac.uk/our-science/projects/farmer-led-moth-recording"
            prefix={<IonIcon icon={bookOutline} className="size-6" />}
            suffix={<IonIcon icon={openOutline} />}
            className="border-none text-left"
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
          <MenuDateAttr record={sample.attrs} isDisabled={isDisabled} />
          <Select
            options={habitatValues}
            onChange={(habitat: any) => (sample.attrs.habitat = habitat)} // eslint-disable-line
            value={sample.attrs.habitat}
            label="Habitat"
            prefix={<IonIcon src={habitatIcon} className="size-6" />}
            isDisabled={isDisabled}
          />
          {isOtherHabitat && (
            <Input
              label="Other habitat"
              prefix={<IonIcon src={habitatIcon} className="size-6" />}
              onChange={(habitat: any) => (sample.attrs.otherHabitat = habitat)} // eslint-disable-line
              value={sample.attrs.otherHabitat}
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
          className="mx-auto mb-5 mt-10"
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
        sample={sample}
        isDisabled={isDisabled}
        useDoughnut
        allowReidentify
      />

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
