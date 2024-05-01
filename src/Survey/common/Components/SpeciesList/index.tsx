import { useContext } from 'react';
import { observer } from 'mobx-react';
import { useRouteMatch } from 'react-router';
import { InfoMessage, useToast, useAlert, device, Button } from '@flumens';
import { IonList, NavContext } from '@ionic/react';
import Occurrence from 'models/occurrence';
import Sample from 'models/sample';
import Species from './Species';
import UnidentifiedSpecies from './UnidentifiedSpecies';

const isUnknown = (value: boolean) => (model: Model) =>
  !!model.getSpecies() === value;

type Model = Sample | Occurrence;

function byCreateTime(m1: Model, m2: Model) {
  const date1 = new Date(m1.metadata.createdOn);
  const date2 = new Date(m2.metadata.createdOn);
  return date2.getTime() - date1.getTime();
}

const hasOver5UnidentifiedSpecies = (
  sample: Sample,
  useSubSamples: boolean
) => {
  const unIdentifiedSpecies = (model: Model) => {
    const occ = model instanceof Occurrence ? model : model.occurrences[0];
    return !occ.getSpecies() && occ.canReIdentify() && !occ.isIdentifying();
  };

  const list: any = useSubSamples ? sample.samples : sample.occurrences;
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
  useSubSamples?: boolean;
  useSpeciesProfile?: boolean;
  disableAI?: boolean;
  disableDelete?: boolean;
  useDoughnut?: boolean;
};

const SpeciesList = ({
  sample,
  isDisabled,
  disableAI = false,
  disableDelete = false,
  useSubSamples = false,
  useSpeciesProfile = false,
  useDoughnut = false,
}: Props) => {
  const { navigate } = useContext(NavContext);
  const { url } = useRouteMatch();
  const toast = useToast();
  const alert = useAlert();

  const rawList = !useSubSamples ? sample.occurrences : sample.samples;
  const list = [...rawList].sort(byCreateTime);

  if (!list.length) return null;

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

  const onDelete = (model: Model) => deleteSample(model, alert);

  const navigateToSpeciesSample = (model: Model) => {
    if (!useSpeciesProfile || isDisabled) return;

    navigate(`${url}/species/${model.cid}`);
  };

  const getSpeciesList = () => {
    const getSpecies = (model: Model) => (
      <Species
        key={model.cid}
        model={model}
        isDisabled={isDisabled}
        onDelete={!disableDelete ? onDelete : undefined}
        onClick={navigateToSpeciesSample}
        useDoughnut={useDoughnut}
      />
    );

    const speciesEntries = list.filter(isUnknown(true)).map(getSpecies);

    if (!speciesEntries.length) return null;

    return (
      <IonList id="list" lines="full">
        <div className="rounded-list">
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
      !disableAI && hasOver5UnidentifiedSpecies(sample, useSubSamples);

    const getSpecies = (model: Model) => (
      <UnidentifiedSpecies
        key={model.cid}
        model={model}
        isDisabled={isDisabled}
        onIdentify={onIdentify}
        deEmphasisedIdentifyBtn={showIdentifyAllBtn}
        onDelete={!disableDelete ? onDelete : undefined}
        onClick={navigateToSpeciesSample}
        disableAI={disableAI}
      />
    );

    const speciesEntries = list.filter(isUnknown(false)).map(getSpecies);

    const count = speciesEntries.length > 1 ? speciesEntries.length : null;

    if (speciesEntries.length < 1) return null;

    return (
      <IonList id="list" lines="full">
        <div className="rounded-list">
          <div className="list-divider">
            <div>Unidentified species</div>

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
