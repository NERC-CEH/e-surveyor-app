import { useContext } from 'react';
import { observer } from 'mobx-react';
import {
  createOutline,
  leaf,
  bookmarkOutline,
  informationCircleOutline,
  addCircleOutline,
} from 'ionicons/icons';
import { useRouteMatch } from 'react-router-dom';
import { Main, MenuAttrItem, InfoMessage, InfoButton, Button } from '@flumens';
import {
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonItemDivider,
  NavContext,
} from '@ionic/react';
import personTakingPhoto from 'common/images/personTakingPhoto.jpg';
import Sample from 'models/sample';
import InfoBackgroundMessage from 'Components/InfoBackgroundMessage';
import UploadedRecordInfoMessage from 'Survey/common/Components/UploadedRecordInfoMessage';
import './styles.scss';

function byDate(smp1: Sample, smp2: Sample) {
  const date1 = new Date(smp1.data.date);
  const date2 = new Date(smp2.data.date);
  return date2.getTime() - date1.getTime();
}

type Props = {
  sample: Sample;
  onAddNewQuadrat: () => void;
  isDisabled?: boolean;
};

const MainComponent = ({ sample, isDisabled, onAddNewQuadrat }: Props) => {
  const match = useRouteMatch();
  const { navigate } = useContext(NavContext);

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
          <IonLabel slot="end">{`${sample.samples.length}/${sample.data.steps}`}</IonLabel>
        </IonItemDivider>

        <div className="rounded-list">{quadrats.map(getQuadrat)}</div>
      </IonList>
    );
  };

  const getAddButton = () => {
    if (isDisabled) {
      return null;
    }

    if (sample.samples.length >= sample.data.steps) {
      return null;
    }

    return (
      <Button
        onPress={onAddNewQuadrat}
        color="secondary"
        prefix={<IonIcon icon={addCircleOutline} className="size-6" />}
        className="bg-secondary-600 mx-auto mt-8 mb-2"
      >
        Add Quadrat
      </Button>
    );
  };

  const isComplete = sample.metadata.saved || sample.isDisabled; // disabled for backwards compatibility

  return (
    <Main>
      {!isDisabled && (
        <InfoMessage
          prefix={<IonIcon src={informationCircleOutline} className="size-6" />}
          color="tertiary"
          className="m-2"
        >
          How to complete a transect?
          <InfoButton color="dark" label="READ MORE" header="Tips">
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

      <IonList lines="full">
        <div className="rounded-list">
          {isDisabled && <UploadedRecordInfoMessage />}
        </div>

        {isComplete && (
          <Button
            color="secondary"
            className="bg-secondary-600 mx-auto my-5"
            onPress={() => navigate(`${match.url}/report`)}
          >
            See Report
          </Button>
        )}

        <div className="rounded-list">
          <MenuAttrItem
            routerLink={`${match.url}/details`}
            icon={createOutline}
            value={sample.data.type}
            label="Details"
            skipValueTranslation
            disabled={isDisabled}
          />
          <MenuAttrItem
            routerLink={`${match.url}/name`}
            icon={bookmarkOutline}
            value={sample.data.name}
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
