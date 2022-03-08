import React, { FC, useContext, useState } from 'react';
import { Main, URL } from '@flumens';
import { observer } from 'mobx-react';
import { useRouteMatch } from 'react-router-dom';
import SpeciesCard from 'common/Components/SpeciesCard';
import {
  IonButton,
  IonList,
  IonIcon,
  NavContext,
  isPlatform,
} from '@ionic/react';
import { searchOutline, close, cropOutline } from 'ionicons/icons';
import PhotoPicker from 'common/Components/PhotoPicker';
import Sample from 'models/sample';
import Image from 'models/image';
import { Species } from 'models/occurrence.d';
import config from 'common/config';
import ImageCropper from 'common/Components/ImageCropper';
import './styles.scss';

type Props = {
  sample: typeof Sample;
  isDisabled: boolean;
};

const EditSpeciesMain: FC<Props> = ({ sample, isDisabled }) => {
  const { navigate } = useContext(NavContext);
  const match = useRouteMatch();
  const [editImage, setEditImage] = useState<Image>();

  const [occ] = sample.occurrences;

  const onDoneEdit = async (image: URL) => {
    if (!editImage) return;

    const newImageModel = await Image.getImageModel(image, config.dataPath);
    Object.assign(editImage?.attrs, newImageModel.attrs);
    editImage.save();
    setEditImage(undefined);
  };

  const onCancelEdit = () => setEditImage(undefined);

  // eslint-disable-next-line react/no-unstable-nested-components
  const ImageWithCropping = ({ media, onDelete, onClick }: any) => {
    const cropImage = () => {
      setEditImage(media);
    };

    return (
      <div className="img">
        {!isDisabled && (
          <IonButton fill="clear" class="delete" onClick={onDelete}>
            <IonIcon icon={close} />
          </IonButton>
        )}
        <img
          src={media.getURL()}
          alt=""
          onClick={onClick} // TODO: fix
        />
        {!isDisabled && (
          <IonButton className="crop-button" onClick={cropImage}>
            <IonIcon icon={cropOutline} />
          </IonButton>
        )}
      </div>
    );
  };

  const getSelectedSpecies = () => {
    const { taxon: sp } = occ.attrs;
    if (!sp) return null;

    const selectedSpeciesByUser = !sp.gbif?.id || !!sp.scoreFromAPI;

    return (
      <SpeciesCard species={sp} selectedSpeciesByUser={selectedSpeciesByUser} />
    );
  };

  const getAIResults = () => {
    const getTaxon = (sp: Species) => {
      const taxon = JSON.parse(JSON.stringify(sp));
      taxon.scoreFromAPI = sp.score;
      taxon.score = 1;

      return taxon;
    };

    const setSpeciesAsMain = (sp: Species) => {
      sample.setSpecies(getTaxon(sp));
      sample.save();
    };

    const getSpeciesCard = (sp: Species) => {
      const onSelectWrap = () => setSpeciesAsMain(sp);

      return (
        <SpeciesCard
          key={sp.warehouseId}
          species={sp}
          onSelect={!isDisabled ? onSelectWrap : null}
        />
      );
    };

    const species = sample.getAISuggestions() || [];
    const { taxon } = occ.attrs;

    const nonSelectedSpecies = (sp: Species) =>
      taxon && sp.species.commonNames[0] !== taxon.species.commonNames[0];

    return species.filter(nonSelectedSpecies).map(getSpeciesCard);
  };

  const getSpeciesAddButton = () => {
    if (isDisabled) {
      return null;
    }

    const navigateToSearch = () => navigate(`${match.url}/taxon`);

    return (
      <IonList className="species-add-button">
        <IonButton
          mode="md"
          onClick={navigateToSearch}
          fill="outline"
          className="footer"
        >
          <IonIcon slot="start" src={searchOutline} />
          Search Species
        </IonButton>
      </IonList>
    );
  };

  const showSpeciesMainPhoto = () => (
    <div className="species-main-image-wrapper">
      <div className="rounded">
        <PhotoPicker
          model={occ}
          Image={ImageWithCropping}
          placeholderCount={isPlatform('mobile') ? 1 : 5}
          isDisabled={isDisabled}
        />
      </div>
    </div>
  );

  return (
    <>
      <Main id="edit-species">
        {showSpeciesMainPhoto()}

        <IonList className="species-wrapper">
          {getSelectedSpecies()}

          {getAIResults()}

          {getSpeciesAddButton()}
        </IonList>
      </Main>
      <ImageCropper
        image={editImage?.getURL()}
        onDone={onDoneEdit}
        onCancel={onCancelEdit}
      />
    </>
  );
};

export default observer(EditSpeciesMain);
