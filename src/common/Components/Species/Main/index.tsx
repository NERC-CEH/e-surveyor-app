import React, { FC, useContext, useState, useEffect } from 'react';
import { Main, URL, useLoader } from '@flumens';
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
import Occurrence, { Taxon } from 'models/occurrence';
import Image from 'models/image';
import config from 'common/config';
import ImageCropper from 'common/Components/ImageCropper';
import './styles.scss';

type Props = {
  occurrence: Occurrence;
};

const EditSpeciesMain: FC<Props> = ({ occurrence }) => {
  const { navigate } = useContext(NavContext);
  const match = useRouteMatch();
  const [editImage, setEditImage] = useState<Image>();
  const loader = useLoader();

  const isDisabled = occurrence.isDisabled();

  const isIdentifying = occurrence.isIdentifying();

  useEffect(() => {
    if (!loader) return;

    if (occurrence.isIdentifying()) {
      loader.show('Please wait...');
      return;
    }

    loader.hide();
  }, [loader, isIdentifying]);

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
    const { taxon: sp } = occurrence.attrs;
    if (!sp) return null;

    const selectedSpeciesByUser = !sp.gbif?.id || !!sp.scoreFromAPI;

    return (
      <SpeciesCard species={sp} selectedSpeciesByUser={selectedSpeciesByUser} />
    );
  };

  const getAIResults = () => {
    const getTaxon = (sp: Taxon) => {
      const taxon = JSON.parse(JSON.stringify(sp));
      taxon.scoreFromAPI = sp.score;
      taxon.score = 1;

      return taxon;
    };

    const setSpeciesAsMain = (sp: Taxon) => {
      // eslint-disable-next-line no-param-reassign
      occurrence.attrs.taxon = getTaxon(sp);
      occurrence.save();
    };

    const getSpeciesCard = (sp: Taxon) => {
      const onSelectWrap = () => setSpeciesAsMain(sp);

      if (sp.score <= 0.01) return null; // 1%

      return (
        <SpeciesCard
          key={sp.warehouseId}
          species={sp}
          onSelect={!isDisabled ? onSelectWrap : null}
        />
      );
    };

    const image = occurrence.media[0];
    if (!image || !image.attrs.species?.length) return [];

    const species = image.attrs.species || [];
    const { taxon } = occurrence.attrs;

    const nonSelectedSpecies = (sp: Taxon) =>
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
          model={occurrence}
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
