import React, { FC, useContext, useState } from 'react';
import {
  IonTabButton,
  IonIcon,
  IonLabel,
  IonFooter,
  IonButton,
  IonModal,
  IonMenuButton,
  IonToolbar,
  IonHeader,
  NavContext,
} from '@ionic/react';
import { ModalHeader, Page, device, toast } from '@flumens';
import ImageHelp from 'common/Components/PhotoPicker/imageUtils';
import savedSamples from 'models/savedSamples';
import config from 'common/config';
import ImageModel from 'models/image';
import identifyImage from 'common/services/plantNet';
import flowerIcon from 'common/images/flowerIcon.svg';
import pointIcon from 'common/images/pointIcon.svg';
import transectIcon from 'common/images/transectIcon.svg';
import SpeciesProfile from './components/SpeciesProfile';
import Main from './Main';
import './styles.scss';

const { warn } = toast;

const HomeController: FC = () => {
  const { navigate } = useContext(NavContext);
  const [image, setImage] = useState<any>(null);

  const getModal = () => (
    <IonModal isOpen={!!image} backdropDismiss={false}>
      <ModalHeader title="Species" onClose={hideSpeciesModal} />
      <SpeciesProfile species={image} />
    </IonModal>
  );

  const identifyPhoto = async () => {
    if (!device.isOnline()) {
      warn('Looks like you are offline!');
      return;
    }

    const photo = await ImageHelp.getImage();
    if (!photo) {
      return;
    }

    const image = await ImageHelp.getImageModel(
      ImageModel,
      photo,
      config.dataPath
    );

    setImage(image);

    image.identification.identifying = true;
    try {
      const species = (await identifyImage(image)) || [];

      image.identification.identifying = false;
      image.attrs.species = species;
    } catch (err) {
      image.identification.identifying = false;
    }
  };

  const startTransect = () => navigate('/survey/transect');

  const getFooter = () => (
    <IonFooter>
      <div className="inner-wrap">
        <div onClick={identifyPhoto}>
          <IonTabButton>
            <IonIcon icon={flowerIcon} />
            <IonLabel>Plant ID</IonLabel>
          </IonTabButton>
        </div>

        <IonButton routerLink="/survey/point">
          <IonIcon icon={pointIcon} />
        </IonButton>

        <div onClick={startTransect}>
          <IonTabButton>
            <IonIcon icon={transectIcon} />
            <IonLabel>Transect</IonLabel>
          </IonTabButton>
        </div>
      </div>
    </IonFooter>
  );

  const hideSpeciesModal = () => setImage(null);

  return (
    <Page id="home">
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonMenuButton slot="start" />
        </IonToolbar>
      </IonHeader>

      <Main savedSamples={savedSamples} />

      {getFooter()}

      {getModal()}
    </Page>
  );
};

export default HomeController;
