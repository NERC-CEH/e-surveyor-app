import React from 'react';
import PropTypes from 'prop-types';
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
import appModel from 'models/app';
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

class Component extends React.Component {
  static contextType = NavContext;

  static propTypes = {
    history: PropTypes.object,
  };

  constructor() {
    super();
    this.fabRef = React.createRef();
    this.state = { image: null };
  }

  getModal = () => (
    <IonModal isOpen={!!this.state.image} backdropDismiss={false}>
      <ModalHeader title="Species" onClose={this.hideSpeciesModal} />
      <SpeciesProfile species={this.state.image} />
    </IonModal>
  );

  identifyPhoto = async () => {
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
    this.setState({ image });

    image.identification.identifying = true;
    try {
      const species = (await identifyImage(image)) || [];

      image.identification.identifying = false;
      image.attrs.species = species;
    } catch (err) {
      image.identification.identifying = false;
    }
  };

  startTransect = () => {
    this.context.navigate('/survey/transect');
  };

  getFooter = () => (
    <IonFooter>
      <div className="inner-wrap">
        <div onClick={this.identifyPhoto}>
          <IonTabButton>
            <IonIcon icon={flowerIcon} />
            <IonLabel>Plant ID</IonLabel>
          </IonTabButton>
        </div>

        <IonButton routerLink="/survey/point">
          <IonIcon icon={pointIcon} />
        </IonButton>

        <div onClick={this.startTransect}>
          <IonTabButton>
            <IonIcon icon={transectIcon} />
            <IonLabel>Transect</IonLabel>
          </IonTabButton>
        </div>
      </div>
    </IonFooter>
  );

  hideSpeciesModal = () => {
    this.setState({ image: null });
  };

  render(props) {
    return (
      <Page id="home">
        <IonHeader className="ion-no-border">
          <IonToolbar>
            <IonMenuButton slot="start" />
          </IonToolbar>
        </IonHeader>

        <Main appModel={appModel} savedSamples={savedSamples} {...props} />

        {this.getFooter()}

        {this.getModal()}
      </Page>
    );
  }
}

export default Component;
