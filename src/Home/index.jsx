import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import {
  IonTabs,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonTabBar,
  IonRouterOutlet,
  IonFab,
  IonFabButton,
  IonModal,
} from '@ionic/react';
import { ModalHeader } from '@apps';
import { albumsOutline } from 'ionicons/icons';
import savedSamples from 'savedSamples';
import appModel from 'appModel';
import ImageHelp from 'helpers/image';
import ImageModel from 'common/models/image';
import identifyImage from 'common/services/plantNet';
import SpeciesProfile from './components/SpeciesProfile';
import SurveysList from './List';
import './styles.scss';
import './flower.svg';
import './route.svg';

class Component extends React.Component {
  static propTypes = {
    history: PropTypes.object,
  };

  constructor() {
    super();
    this.fabRef = React.createRef();
    this.state = { image: null };
  }

  photoUpload = async e => {
    const photo = e.target.files[0];

    const image = await ImageHelp.getImageModel(ImageModel, photo);
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

  hideSpeciesModal = () => {
    this.setState({ image: null });
  };

  render() {
    const SurveysListWrap = props => (
      <SurveysList appModel={appModel} savedSamples={savedSamples} {...props} />
    );

    return (
      <>
        <IonModal isOpen={!!this.state.image} backdropDismiss={false}>
          <ModalHeader title="Species" onClose={this.hideSpeciesModal} />
          {!!this.state.image && <SpeciesProfile species={this.state.image} />}
        </IonModal>

        <IonFab
          className="img-picker"
          vertical="bottom"
          horizontal="center"
          slot="fixed"
        >
          <IonFabButton size="small">
            <input type="file" accept="image/*" onChange={this.photoUpload} />
            <IonIcon src="/images/flower.svg" />
          </IonFabButton>
        </IonFab>

        <IonFab
          ref={this.fabRef}
          vertical="bottom"
          horizontal="center"
          onClick={this.nav}
          slot="fixed"
        >
          <IonFabButton className="new-survey" href="/survey">
            <IonIcon src="/images/route.svg" />
          </IonFabButton>
        </IonFab>

        <IonTabs>
          <IonRouterOutlet>
            <Route path="/home/surveys" render={SurveysListWrap} exact />
          </IonRouterOutlet>

          <IonTabBar slot="bottom">
            <IonTabButton>{/* placeholder */}</IonTabButton>

            <IonTabButton>{/* placeholder */}</IonTabButton>
            <IonTabButton
              tab="complex-survey-mockup"
              href="/info/mockup-survey"
            >
              <IonIcon icon={albumsOutline} />
              <IonLabel className="farm-surveys-label">Transects</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </>
    );
  }
}

export default Component;
