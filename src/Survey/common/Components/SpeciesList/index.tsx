import { FC, useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import { useRouteMatch } from 'react-router';
import { InfoMessage, useToast, useAlert, device, Button } from '@flumens';
import { IonList, NavContext } from '@ionic/react';
import config from 'common/config';
import appModel from 'models/app';
import Occurrence from 'models/occurrence';
import Sample from 'models/sample';
import InfoBackgroundMessage from 'Components/InfoBackgroundMessage';
import Species from './Species';
import UnidentifiedSpecies from './UnidentifiedSpecies';

const { POSITIVE_THRESHOLD } = config;

const isUnknown = (value: boolean) => (model: Model) =>
  !!model.getSpecies() === value;

type Model = Sample | Occurrence;

function byCreateTime(m1: Model, m2: Model) {
  const date1 = new Date(m1.metadata.createdOn);
  const date2 = new Date(m2.metadata.createdOn);
  return date2.getTime() - date1.getTime();
}

const hasOver5UnidentifiedSpecies = (sample: Sample) => {
  const unIdentifiedSpecies = (model: Model) => {
    const occ = model instanceof Occurrence ? model : model.occurrences[0];
    return !occ.getSpecies() && occ.canReIdentify() && !occ.isIdentifying();
  };

  const useOccurrences = sample.metadata.survey === 'beetle';
  const list: any = useOccurrences ? sample.occurrences : sample.samples;
  return list.filter(unIdentifiedSpecies).length >= 5;
};

function deleteSample(sample: Model, alert: any) {
  alert({
    header: 'Delete',
    skipTranslation: true,
    message: 'Are you sure you want to remove this entry from your survey?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'primary',
      },
      {
        text: 'Delete',
        cssClass: 'danger',
        handler: () => sample.destroy(),
      },
    ],
  });
}

type Props = {
  sample: Sample;
  isDisabled: boolean;
  disableAI?: boolean;
};

const SpeciesList: FC<Props> = ({ sample, isDisabled, disableAI = false }) => {
  const { navigate } = useContext(NavContext);
  const { url } = useRouteMatch();
  const toast = useToast();
  const alert = useAlert();

  const isBeetleSurvey = sample.metadata.survey === 'beetle';
  const rawList = isBeetleSurvey ? sample.occurrences : sample.samples;
  const list = [...rawList].sort(byCreateTime);

  useEffect(() => {
    if (isBeetleSurvey) return;

    const hasSpeciesWithLowScore = (model: Model) => {
      const occ = model instanceof Occurrence ? model : model.occurrences[0];
      const score = occ.getSpecies()?.score;
      if (
        score &&
        score < POSITIVE_THRESHOLD &&
        appModel.attrs.showFirstLowScorePhotoTip
      ) {
        alert({
          message:
            "The AI isn't sure about your photo, tap to check other possible species.",
          buttons: [{ text: 'OK' }],
        });
        appModel.attrs.showFirstLowScorePhotoTip = false;
      }
    };
    (list as Model[]).some(hasSpeciesWithLowScore);
  }, [list]);

  if (!list.length) {
    if (isBeetleSurvey)
      return (
        <IonList>
          {/* <InfoBackgroundMessage>
            Your species list is empty. <br /> Tap the orange species button to
            take a photo of a beetle for the AI to identify.
          </InfoBackgroundMessage> */}
          <InfoBackgroundMessage>
            Your species list is empty. <br /> Tap the orange species button to
            add your first beetle.
          </InfoBackgroundMessage>
        </IonList>
      );

    return (
      <IonList>
        <InfoBackgroundMessage>
          Your species list is empty. <br /> Hold down the orange species button
          to list plant species yourself, or tap to take a photo for the AI to
          identify.
        </InfoBackgroundMessage>
      </IonList>
    );
  }

  const onIdentifyAll = async () => {
    if (!device.isOnline) {
      toast.warn("Sorry, looks like you're offline.");
      return;
    }

    const identify = (model: Model) =>
      model instanceof Occurrence
        ? model.identify()
        : model.occurrences[0].identify();

    try {
      await Promise.all(list.map(identify));
    } catch (e: any) {
      toast.error(e.message, { position: 'bottom' });
    }
  };

  const onIdentify = async (model: Model) => {
    if (!device.isOnline) {
      toast.warn("Sorry, looks like you're offline.");
      return;
    }

    try {
      await (model instanceof Occurrence
        ? model.identify()
        : model.occurrences[0].identify());
    } catch (e: any) {
      toast.error(e.message, { position: 'bottom' });
    }
  };

  const onDelete = (model: Model) => {
    deleteSample(model, alert);
  };
  const navigateToSpeciesSample = (model: Model) => {
    if (isBeetleSurvey && isDisabled) return;

    navigate(`${url}/species/${model.cid}`);
  };

  const getSpeciesList = () => {
    const getSpecies = (model: Model) => (
      <Species
        key={model.cid}
        model={model}
        isDisabled={isDisabled}
        onDelete={!isBeetleSurvey ? onDelete : undefined}
        onClick={navigateToSpeciesSample}
      />
    );

    const speciesEntries = list.filter(isUnknown(true)).map(getSpecies);

    if (!speciesEntries.length) return null;

    return (
      <IonList id="list" lines="full">
        <div className="rounded">
          <div className="list-divider">
            <div>Species</div>
            <div>{speciesEntries.length}</div>
          </div>

          {speciesEntries}
        </div>
      </IonList>
    );
  };

  const getUnidentifiedSpeciesList = () => {
    const showIdentifyAllBtn =
      !disableAI && hasOver5UnidentifiedSpecies(sample);

    const getSpecies = (model: Model) => (
      <UnidentifiedSpecies
        key={model.cid}
        model={model}
        isDisabled={isDisabled}
        onIdentify={onIdentify}
        deEmphasisedIdentifyBtn={showIdentifyAllBtn}
        onDelete={!isBeetleSurvey ? onDelete : undefined}
        onClick={navigateToSpeciesSample}
        disableAI={disableAI}
      />
    );

    const speciesEntries = list.filter(isUnknown(false)).map(getSpecies);

    const count = speciesEntries.length > 1 ? speciesEntries.length : null;

    if (speciesEntries.length < 1) return null;

    return (
      <IonList id="list" lines="full">
        <div className="rounded">
          <div className="list-divider">
            <div>Unknown species</div>

            {!showIdentifyAllBtn && <div>{count}</div>}

            {showIdentifyAllBtn && (
              <Button
                onPress={onIdentifyAll}
                color="secondary"
                className="py-1 text-xs"
              >
                Identify All
              </Button>
            )}
          </div>

          {!device.isOnline && (
            <InfoMessage color="warning" inline>
              Auto-identification will not work while the device is offline.
            </InfoMessage>
          )}

          {speciesEntries}
        </div>
      </IonList>
    );
  };

  return (
    <>
      {getUnidentifiedSpeciesList()}

      {getSpeciesList()}
    </>
  );
};

export default observer(SpeciesList);
