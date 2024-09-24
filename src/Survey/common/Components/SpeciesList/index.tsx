import { useContext } from 'react';
import { observer } from 'mobx-react';
import { useRouteMatch } from 'react-router';
import { Capacitor } from '@capacitor/core';
import {
  InfoMessage,
  useToast,
  device,
  Button,
  usePromptImageSource,
  captureImage,
} from '@flumens';
import { IonList, isPlatform, NavContext } from '@ionic/react';
import CONFIG from 'common/config';
import Media from 'models/image';
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

type Props = {
  sample: Sample;
  isDisabled: boolean;
  useSubSamples?: boolean;
  useSpeciesProfile?: boolean;
  disableAI?: boolean;
  disableDelete?: boolean;
  useDoughnut?: boolean;
  allowReidentify?: boolean;
};

const SpeciesList = ({
  sample,
  isDisabled,
  disableAI = false,
  disableDelete = false,
  useSubSamples = false,
  useSpeciesProfile = false,
  useDoughnut = false,
  allowReidentify = false,
}: Props) => {
  const { navigate } = useContext(NavContext);
  const { url } = useRouteMatch();
  const toast = useToast();
  const promptImageSource = usePromptImageSource();

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

  const onReidentify = async (model: Model) => {
    if (!device.isOnline) {
      toast.warn("Sorry, looks like you're offline.");
      return;
    }

    async function getImage() {
      const shouldUseCamera = await promptImageSource();
      const cancelled = shouldUseCamera === null;
      if (cancelled) return [];

      const images = await captureImage(
        shouldUseCamera ? { camera: true } : { multiple: false }
      );
      if (!images.length) return [];

      const getImageModel = (image: any) =>
        Media.getImageModel(
          isPlatform('hybrid') ? Capacitor.convertFileSrc(image) : image,
          CONFIG.dataPath
        ) as Promise<Media>;

      const imageModels = images.map(getImageModel);

      return Promise.all(imageModels);
    }

    try {
      const images = await getImage();
      if (!images.length) return;

      const occ = model instanceof Occurrence ? model : model.occurrences[0];
      await occ.media[0].destroy();
      delete occ.attrs.taxon;
      occ.media.push(images[0]);

      await occ.identify();
    } catch (e: any) {
      toast.error(e.message, { position: 'bottom' });
    }
  };

  const navigateToSpeciesSample = (model: Model) => {
    if (!useSpeciesProfile || isDisabled) return;

    navigate(`${url}/species/${model.cid}`);
  };

  const getSpeciesList = () => {
    const getSpecies = (model: Model) => {
      const onDelete = () => model.destroy();

      return (
        <Species
          key={model.cid}
          model={model}
          isDisabled={isDisabled}
          onDelete={!disableDelete ? onDelete : undefined}
          onClick={navigateToSpeciesSample}
          onReidentify={allowReidentify ? onReidentify : undefined}
          useDoughnut={useDoughnut}
        />
      );
    };

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

    const getSpecies = (model: Model) => {
      const onDelete = () => model.destroy();

      return (
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
    };

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
