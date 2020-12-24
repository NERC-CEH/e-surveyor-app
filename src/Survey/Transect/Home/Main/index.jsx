import { observer } from 'mobx-react';
import React from 'react';
import PropTypes from 'prop-types';
import {
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonItemDivider,
} from '@ionic/react';
import { createOutline, leaf } from 'ionicons/icons';
import { Main, MenuAttrItem, MenuNote } from '@apps';
import './styles.scss';

function byDate(smp1, smp2) {
  const date1 = new Date(smp1.attrs.date);
  const date2 = new Date(smp2.attrs.date);
  return date2.getTime() - date1.getTime();
}

@observer
class MainComponent extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    sample: PropTypes.object.isRequired,
    onAddNewQuadrat: PropTypes.func.isRequired,
    isDisabled: PropTypes.bool,
  };

  getQuadratsList() {
    const { sample } = this.props;

    return sample.samples.slice().sort(byDate);
  }

  getQuadratPhoto = sample => {
    const pic = sample.media[0] && sample.media[0].getURL();

    const photo = pic ? <img src={pic} /> : <IonIcon icon={leaf} />;

    return <div className="photo">{photo}</div>;
  };

  getList = () => {
    const { match, sample } = this.props;

    const quadrats = this.getQuadratsList();

    if (!quadrats.length) {
      return (
        <IonList lines="none">
          <IonItem className="empty">
            <div>You have not added any quadrats yet.</div>
          </IonItem>
        </IonList>
      );
    }

    const getQuadrat = quadratSample => (
      <IonItem
        key={quadratSample.cid}
        routerLink={`${match.url}/quadrat/${quadratSample.cid}`}
        detail
      >
        {this.getQuadratPhoto(quadratSample)}

        <IonLabel text-wrap>
          <IonLabel>
            <b>{quadratSample.getPrettyName()}</b>
          </IonLabel>
        </IonLabel>
      </IonItem>
    );

    return (
      <IonList className="quadrats-list" lines="full">
        <IonItemDivider mode="ios">
          Quadrats
          <IonLabel slot="end">{`${sample.samples.length}/${sample.attrs.steps}`}</IonLabel>
        </IonItemDivider>

        {quadrats.map(getQuadrat)}
      </IonList>
    );
  };

  getAddButton = () => {
    const { sample, onAddNewQuadrat, isDisabled } = this.props;

    if (isDisabled) {
      return null;
    }

    if (sample.samples.length >= sample.attrs.steps) {
      return null;
    }

    return (
      <IonButton
        onClick={onAddNewQuadrat}
        color="secondary"
        onLongClick={this.navigateToSearch}
        type="submit"
        expand="block"
      >
        Add Quadrat
      </IonButton>
    );
  };

  render() {
    const { match, isDisabled, sample } = this.props;

    return (
      <Main>
        <IonList lines="full">
          {isDisabled && (
            <MenuNote>
              This survey has been finished and cannot be updated.
            </MenuNote>
          )}

          <MenuAttrItem
            routerLink={`${match.url}/details`}
            icon={createOutline}
            value={sample.attrs.type}
            label="Details"
            skipValueTranslation
            disabled={isDisabled}
          />
        </IonList>

        {this.getAddButton()}

        {this.getList()}
      </Main>
    );
  }
}

export default MainComponent;
