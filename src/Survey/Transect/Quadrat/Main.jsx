import { observer } from 'mobx-react';
import React from 'react';
import PropTypes from 'prop-types';
import { IonItemDivider, IonList, IonIcon, NavContext } from '@ionic/react';
import { camera, locationOutline } from 'ionicons/icons';
import image from 'common/models/image';
import { Main, MenuAttrItem, PhotoPicker, LongPressButton } from '@apps';
import config from 'config';
import GridRefValue from 'Survey/common/Components/GridRefValue';
import SpeciesList from 'Survey/common/Components/SpeciesList';

@observer
class MainComponent extends React.Component {
  static contextType = NavContext;

  static propTypes = {
    subSample: PropTypes.object.isRequired,
    photoSelect: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    isDisabled: PropTypes.bool,
  };

  getNewImageButton = photoSelect => {
    const { isDisabled } = this.props;

    if (isDisabled) {
      return <br />;
    }

    return (
      <LongPressButton
        color="secondary"
        onLongClick={this.navigateToSearch}
        type="submit"
        expand="block"
        onClick={photoSelect}
      >
        <IonIcon slot="start" icon={camera} size="large" />
        Plant
      </LongPressButton>
    );
  };

  navigateToSearch = () => {
    const { match } = this.props;

    this.context.navigate(`${match.url}/taxon`);
  };

  render() {
    const { subSample, match, isDisabled, photoSelect } = this.props;
    const prettyGridRef = <GridRefValue sample={subSample} />;

    return (
      <Main>
        <IonList lines="full">
          <MenuAttrItem
            routerLink={`${match.url}/map`}
            value={prettyGridRef}
            icon={locationOutline}
            label="Location"
            skipValueTranslation
            disabled={isDisabled}
          />
          <IonItemDivider mode="ios">Quadrat photo</IonItemDivider>
          <PhotoPicker
            model={subSample}
            ImageClass={image}
            isDisabled={isDisabled}
            dataDirPath={config.dataPath}
          />
        </IonList>

        {this.getNewImageButton(photoSelect)}

        <SpeciesList sample={subSample} match={match} isDisabled={isDisabled} />
      </Main>
    );
  }
}

export default MainComponent;
