import { observer } from 'mobx-react';
import React from 'react';
import { IonItemDivider, IonIcon, IonList, NavContext } from '@ionic/react';
import { Main, alert, MenuAttrItem, LongPressButton, MenuNote } from '@flumens';
import { camera, bookmarkOutline, locationOutline } from 'ionicons/icons';
import PropTypes from 'prop-types';
import Seeds from 'common/images/seeds.svg';
import GridRefValue from 'Survey/common/Components/GridRefValue';
import SpeciesList from 'Survey/common/Components/SpeciesList';
import 'ionicons/dist/svg/checkmark-circle-outline.svg';
import 'ionicons/dist/svg/help-circle-outline.svg';
import 'ionicons/dist/svg/close-circle-outline.svg';

@observer
class Component extends React.Component {
  static contextType = NavContext;

  static propTypes = {
    sample: PropTypes.object.isRequired,
    photoSelect: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    appModel: PropTypes.object.isRequired,
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

  showFirstSurveyTip = () => {
    const { appModel } = this.props;

    if (!appModel.attrs.showFirstSurveyTip) {
      return;
    }

    alert({
      skipTranslation: true,
      header: 'Your first survey',
      message: (
        <>
          You can add plant photos using your camera and we will try to identify
          them for you. Alternatively, you can long-press the button to enter
          the species manually.
        </>
      ),
      buttons: [
        {
          text: 'OK, got it',
          role: 'cancel',
          cssClass: 'primary',
        },
      ],
    });

    appModel.attrs.showFirstSurveyTip = false;
    appModel.save();
  };

  componentDidMount() {
    this.showFirstSurveyTip();
  }

  render() {
    const { match, sample, photoSelect, isDisabled } = this.props;

    const { seedmixgroup, seedmix, name } = sample.attrs;

    const prettyGridRef = <GridRefValue sample={sample} />;

    const baseURL = match.url;

    return (
      <Main>
        <IonList lines="full">
          {isDisabled && (
            <MenuNote>
              This survey has been finished and cannot be updated.
            </MenuNote>
          )}

          <MenuAttrItem
            routerLink={`${baseURL}/name`}
            icon={bookmarkOutline}
            label="Name"
            value={name}
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

          <IonItemDivider mode="ios">Seed mix</IonItemDivider>
          <MenuAttrItem
            routerLink={`${baseURL}/seedmixgroup`}
            icon={Seeds}
            label="Supplier"
            value={seedmixgroup}
            disabled={isDisabled}
          />

          <MenuAttrItem
            routerLink={`${baseURL}/seedmix`}
            icon={Seeds}
            label="Name"
            value={seedmix}
            styles="opacity:0.8"
            disabled={!seedmixgroup || isDisabled}
          />
        </IonList>

        {this.getNewImageButton(photoSelect)}

        <SpeciesList sample={sample} match={match} isDisabled={isDisabled} />
      </Main>
    );
  }
}

export default Component;
