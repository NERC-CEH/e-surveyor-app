import { observer } from 'mobx-react';
import React, { FC, useContext } from 'react';
import {
  IonItem,
  IonLabel,
  IonList,
  IonButton,
  IonItemDivider,
  NavContext,
} from '@ionic/react';
import { useRouteMatch } from 'react-router';
import { InfoMessage, useToast, useAlert } from '@flumens';
import network from 'helpers/network';
import Sample from 'models/sample';
import Occurrence from 'models/occurrence';
import clsx from 'clsx';
import UnidentifiedSpecies from './Components/UnidentifiedSpecies';
import Species from './Components/Species';
import './styles.scss';

type Props = {
  sample: typeof Sample;
  isDisabled: boolean;
};

const isUnkown = (value: boolean) => (smp: typeof Sample) =>
  !!smp.getSpecies() === value;

function byCreateTime(occ1: typeof Occurrence, occ2: typeof Occurrence) {
  const date1 = new Date(occ1.metadata.created_on);
  const date2 = new Date(occ2.metadata.created_on);
  return date2.getTime() - date1.getTime();
}

const hasOver5UnidentifiedSpecies = (sample: typeof Sample) => {
  const unIdentifiedSpecies = (smp: typeof Sample) => {
    const [occ] = smp.occurrences;
    return !occ.getSpecies() && occ.canReIdentify() && !occ.isIdentifying();
  };

  return sample.samples.filter(unIdentifiedSpecies).length >= 5;
};

function deleteSample(sample: typeof Sample, alert: any) {
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

  if (!sample.samples.length) {
    return (
      <IonList>
        <IonItem className="empty">
          <span>Your species list is empty.</span>
        </IonItem>
      </IonList>
    );
  }

  const list = [...sample.samples].sort(byCreateTime);

  const onIdentifyAll = async () => {
    if (!network.isOnline) {
      toast.warn("Sorry, looks like you're offline.");
      return;
    }

    const identify = (smp: typeof Sample) => smp.occurrences[0].identify();
    try {
      await Promise.all(sample.samples.map(identify));
    } catch (e: any) {
      toast.error(e.message, { position: 'bottom' });
    }
  };

  const onIdentify = async (smp: typeof Sample) => {
    if (!network.isOnline) {
      toast.warn("Sorry, looks like you're offline.");
      return;
    }

    try {
      await smp.occurrences[0].identify();
    } catch (e: any) {
      toast.error(e.message, { position: 'bottom' });
    }
  };

  const onDelete = (smp: typeof Sample) => {
    deleteSample(smp, alert);
  };
  const navigateToSpeciesSample = (smp: typeof Sample) =>
    navigate(`${url}/species/${smp.cid}`);

  const getSpeciesList = () => {
    const getSpecies = (smp: typeof Sample) => (
      <Species
        key={smp.cid}
        sample={smp}
        isDisabled={isDisabled}
        onDelete={onDelete}
        onClick={navigateToSpeciesSample}
      />
    );

    const speciesEntries = list.filter(isUnkown(true)).map(getSpecies);

    return (
      <IonList lines="full">
        <div className="rounded">{speciesEntries}</div>
      </IonList>
    );
  };

  const getUndentifiedSpeciesList = () => {
    const showIdentifyAllBtn = hasOver5UnidentifiedSpecies(sample);

    const getSpecies = (smp: typeof Sample) => (
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

    const speciesEntries = list.filter(isUnkown(false)).map(getSpecies);

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

            {!network.isOnline && (
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
      {getUndentifiedSpeciesList()}

      {getSpeciesList()}
    </>
  );
};

export default observer(SpeciesList);
