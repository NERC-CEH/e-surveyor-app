import React, { FC, useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import {
  IonLabel,
  IonList,
  IonButton,
  IonItemDivider,
  NavContext,
} from '@ionic/react';
import { useRouteMatch } from 'react-router';
import {
  InfoMessage,
  useToast,
  useAlert,
  device,
  InfoBackgroundMessage,
} from '@flumens';
import Sample from 'models/sample';
import appModel from 'models/app';
import Occurrence from 'models/occurrence';
import clsx from 'clsx';
import config from 'common/config';
import UnidentifiedSpecies from './Components/UnidentifiedSpecies';
import Species from './Components/Species';
import './styles.scss';

const { POSITIVE_THRESHOLD } = config;

type Props = {
  sample: Sample;
  isDisabled: boolean;
};

const isUnknown = (value: boolean) => (smp: Sample) =>
  !!smp.getSpecies() === value;

function byCreateTime(occ1: Occurrence, occ2: Occurrence) {
  const date1 = new Date(occ1.metadata.created_on);
  const date2 = new Date(occ2.metadata.created_on);
  return date2.getTime() - date1.getTime();
}

const hasOver5UnidentifiedSpecies = (sample: Sample) => {
  const unIdentifiedSpecies = (smp: Sample) => {
    const [occ] = smp.occurrences;
    return !occ.getSpecies() && occ.canReIdentify() && !occ.isIdentifying();
  };

  return sample.samples.filter(unIdentifiedSpecies).length >= 5;
};

function deleteSample(sample: Sample, alert: any) {
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

const SpeciesList: FC<Props> = ({ sample, isDisabled }) => {
  const { navigate } = useContext(NavContext);
  const { url } = useRouteMatch();
  const toast = useToast();
  const alert = useAlert();

  const list = [...sample.samples].sort(byCreateTime);

  useEffect(() => {
    const hasSpeciesWithLowScore = (smp: Sample) => {
      const score = smp.occurrences[0].attrs.taxon?.score;
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
    list.some(hasSpeciesWithLowScore);
  }, [list]);

  if (!sample.samples.length) {
    return (
      <IonList>
        <InfoBackgroundMessage>
          Your species list is empty. <br /> Hold down the camera button to list
          plant species yourself, or tap to take a photo for the AI to identify.
        </InfoBackgroundMessage>
      </IonList>
    );
  }

  const onIdentifyAll = async () => {
    if (!device.isOnline) {
      toast.warn("Sorry, looks like you're offline.");
      return;
    }

    const identify = (smp: Sample) => smp.occurrences[0].identify();
    try {
      await Promise.all(sample.samples.map(identify));
    } catch (e: any) {
      toast.error(e.message, { position: 'bottom' });
    }
  };

  const onIdentify = async (smp: Sample) => {
    if (!device.isOnline) {
      toast.warn("Sorry, looks like you're offline.");
      return;
    }

    try {
      await smp.occurrences[0].identify();
    } catch (e: any) {
      toast.error(e.message, { position: 'bottom' });
    }
  };

  const onDelete = (smp: Sample) => {
    deleteSample(smp, alert);
  };
  const navigateToSpeciesSample = (smp: Sample) =>
    navigate(`${url}/species/${smp.cid}`);

  const getSpeciesList = () => {
    const getSpecies = (smp: Sample) => (
      <Species
        key={smp.cid}
        sample={smp}
        isDisabled={isDisabled}
        onDelete={onDelete}
        onClick={navigateToSpeciesSample}
      />
    );

    const speciesEntries = list.filter(isUnknown(true)).map(getSpecies);

    return (
      <IonList lines="full">
        <div className="rounded">{speciesEntries}</div>
      </IonList>
    );
  };

  const getUnidentifiedSpeciesList = () => {
    const showIdentifyAllBtn = hasOver5UnidentifiedSpecies(sample);

    const getSpecies = (smp: Sample) => (
      <UnidentifiedSpecies
        key={smp.cid}
        sample={smp}
        isDisabled={isDisabled}
        onIdentify={onIdentify}
        deEmphasisedIdentifyBtn={showIdentifyAllBtn}
        onDelete={onDelete}
        onClick={navigateToSpeciesSample}
      />
    );

    const speciesEntries = list.filter(isUnknown(false)).map(getSpecies);

    const count = speciesEntries.length > 1 ? speciesEntries.length : null;

    if (speciesEntries.length < 1) return null;

    return (
      <>
        <IonList id="list" lines="full">
          <div className="rounded">
            <IonItemDivider className="species-list-header unknown">
              <IonLabel className={clsx(!showIdentifyAllBtn && 'full-width')}>
                Unknown species
              </IonLabel>

              {!showIdentifyAllBtn && (
                <IonLabel className="count">{count}</IonLabel>
              )}

              {showIdentifyAllBtn && (
                <IonButton
                  size="small"
                  onClick={onIdentifyAll}
                  color="secondary"
                >
                  Identify All
                </IonButton>
              )}
            </IonItemDivider>

            {!device.isOnline && (
              <InfoMessage color="dark" className="offline-warning-note">
                Auto-identification will not work while the device is offline.
              </InfoMessage>
            )}

            {speciesEntries}
          </div>
        </IonList>
      </>
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
