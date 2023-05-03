import { FC } from 'react';
import { observer } from 'mobx-react';
import {
  createOutline,
  leaf,
  bookmarkOutline,
  informationCircleOutline,
} from 'ionicons/icons';
import { useRouteMatch } from 'react-router-dom';
import {
  Main,
  MenuAttrItem,
  InfoMessage,
  InfoButton,
  InfoBackgroundMessage,
} from '@flumens';
import {
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonItemDivider,
} from '@ionic/react';
import personTakingPhoto from 'common/images/personTakingPhoto.jpg';
import Sample from 'models/sample';
import './styles.scss';

function byDate(smp1: Sample, smp2: Sample) {
  const date1 = new Date(smp1.attrs.date);
  const date2 = new Date(smp2.attrs.date);
  return date2.getTime() - date1.getTime();
}

type Props = {
  sample: Sample;
  onAddNewQuadrat: () => void;
  isDisabled?: boolean;
};

const MainComponent: FC<Props> = ({ sample, isDisabled, onAddNewQuadrat }) => {
  const match = useRouteMatch();

  const getQuadratsList = () => {
    return sample.samples.slice().sort(byDate);
  };

  const getQuadratPhoto = (smp: Sample) => {
    const pic = smp.media.length && smp.media[0].getURL();

    const photo = pic ? <img src={pic} /> : <IonIcon icon={leaf} />;

    return <div className="photo">{photo}</div>;
  };

  const getList = () => {
    const quadrats = getQuadratsList();

    if (!quadrats.length) {
      return (
        <InfoBackgroundMessage>
          You have not added any quadrats yet.
        </InfoBackgroundMessage>
      );
    }

    const getQuadrat = (quadratSample: Sample) => (
      <IonItem
        key={quadratSample.cid}
        routerLink={`${match.url}/quadrat/${quadratSample.cid}`}
        detail
      >
        {getQuadratPhoto(quadratSample)}

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

        <div className="rounded">{quadrats.map(getQuadrat)}</div>
      </IonList>
    );
  };

  const getAddButton = () => {
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
        type="submit"
        expand="block"
      >
        Add Quadrat
      </IonButton>
    );
  };

  const isComplete = sample.metadata.saved || sample.isDisabled(); // disabled for backwards compatibility

  return (
    <Main>
      {!isDisabled && (
        <InfoMessage icon={informationCircleOutline} className="blue">
          How to complete a transect?
          <InfoButton label="READ MORE" header="Tips">
            <div>
              <img src={personTakingPhoto} />
              <p>
                Give your survey a name (such as the name of the place you are
                surveying).
              </p>
              <p>
                Place your quadrat down in the first spot (or measure out the
                area you will survey), and tap on the "Add quadrat" button.
              </p>
              <p> Take a photo of the entire quadrat.</p>
              <p>
                Then, hold down the orange camera button to start listing plants
                within the quadrat, or tap to take a photo for the AI to
                identify.
              </p>
              <p>
                Keep adding plants until you have listed all of the plants
                within the quadrat, then move on to your next location.
              </p>
              <p>
                Once you have completed all of your quadrats, tap finish to see
                your report.
              </p>
            </div>
          </InfoButton>
        </InfoMessage>
      )}

      {isDisabled && (
        <InfoMessage icon={informationCircleOutline} className="blue">
          This survey has been finished and cannot be updated.
        </InfoMessage>
      )}

      <IonList lines="full">
        {isComplete && (
          <IonButton
            color="secondary"
            type="submit"
            expand="block"
            routerLink={`${match.url}/report`}
          >
            See Report
          </IonButton>
        )}

        <div className="rounded">
          <MenuAttrItem
            routerLink={`${match.url}/details`}
            icon={createOutline}
            value={sample.attrs.type}
            label="Details"
            skipValueTranslation
            disabled={isDisabled}
          />
          <MenuAttrItem
            routerLink={`${match.url}/name`}
            icon={bookmarkOutline}
            value={sample.attrs.name}
            label="Name"
            skipValueTranslation
            disabled={isDisabled}
          />
        </div>
      </IonList>

      {getAddButton()}

      {getList()}
    </Main>
  );
};

export default observer(MainComponent);
