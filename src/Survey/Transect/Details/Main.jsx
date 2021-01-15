import { observer } from 'mobx-react';
import React from 'react';
import PropTypes from 'prop-types';
import { IonItemDivider, IonList } from '@ionic/react';
import { locationOutline } from 'ionicons/icons';
import { Main, MenuAttrItem } from '@apps';
import GridRefValue from 'Survey/common/Components/GridRefValue';
import transectIcon from 'common/images/transectIconBlack.svg';
import Seeds from 'common/images/seeds.svg';
import squareIcon from './square.svg';
import habitatIcon from './habitats.svg';
import stepsIcon from './steps.svg';

@observer
class MainComponent extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    sample: PropTypes.object.isRequired,
    isDisabled: PropTypes.bool,
  };

  render() {
    const { match, sample, isDisabled } = this.props;

    const {
      type,
      seedmixgroup,
      seedmix,
      quadratSize,
      steps,
      habitat,
    } = sample.attrs;
    const { completedDetails } = sample.metadata;

    const prettyGridRef = <GridRefValue sample={sample} />;

    const isCommonStandards = type === 'Common Standards';
    const isCustom = type === 'Custom';

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

          <IonItemDivider mode="ios">Survey</IonItemDivider>
          <MenuAttrItem
            routerLink={`${match.url}/type`}
            value={type}
            icon={transectIcon}
            label="Type"
            skipValueTranslation
            disabled={isDisabled || completedDetails}
          />
          <MenuAttrItem
            routerLink={`${match.url}/steps`}
            value={steps}
            icon={stepsIcon}
            label="Steps"
            skipValueTranslation
            disabled={isDisabled || !isCustom || completedDetails}
          />

          <MenuAttrItem
            routerLink={`${match.url}/quadratSize`}
            value={!!quadratSize && `${quadratSize}m`}
            icon={squareIcon}
            label="Quadrat size"
            skipValueTranslation
            disabled={isDisabled || !isCustom || completedDetails}
          />
          {isCommonStandards && (
            <MenuAttrItem
              routerLink={`${match.url}/habitat`}
              value={habitat}
              icon={habitatIcon}
              label="Habitat"
              skipValueTranslation
              disabled={isDisabled}
            />
          )}

          <IonItemDivider mode="ios">
            <span>
              Seedmix (<i>optional</i>)
            </span>
          </IonItemDivider>
          <MenuAttrItem
            routerLink={`${match.url}/seedmixgroup`}
            icon={Seeds}
            label="Supplier"
            value={seedmixgroup}
            disabled={isDisabled}
          />

          <MenuAttrItem
            routerLink={`${match.url}/seedmix`}
            icon={Seeds}
            label="Name"
            value={seedmix}
            styles="opacity:0.8"
            disabled={!seedmixgroup || isDisabled}
          />
        </IonList>
      </Main>
    );
  }
}

export default MainComponent;
