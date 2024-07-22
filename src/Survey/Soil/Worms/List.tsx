/* eslint-disable no-param-reassign */
import { useContext } from 'react';
import { observer } from 'mobx-react';
import { addOutline } from 'ionicons/icons';
import { useRouteMatch } from 'react-router';
import { Page, Header, Main, Button, InfoMessage, Badge } from '@flumens';
import {
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonList,
  NavContext,
} from '@ionic/react';
import ExpandableList from 'common/Components/ExpandableList';
import InfoBackgroundMessage from 'common/Components/InfoBackgroundMessage';
import { useEntryDeleteConfirmation } from 'common/helpers/hooks';
import Sample from 'models/sample';
import { wormCountAttr } from '../config';
import worm from '../worm.svg';

interface Props {
  sample: Sample;
}

const WormList = ({ sample }: Props) => {
  const { url } = useRouteMatch();
  const { navigate } = useContext(NavContext);
  const confirmEntryDeletion = useEntryDeleteConfirmation();

  const isDisabled = sample.isDisabled();
  const onAddNewSample = () => {
    const survey = sample.getSurvey();
    const wormSample = survey.smp!.create!({ Sample, type: 'worms' });
    sample.samples.push(wormSample);

    navigate(`${url}/${wormSample.cid}`);
  };

  const onSampleDelete = async (smp: Sample) => {
    const shouldDelete = await confirmEntryDeletion();
    if (!shouldDelete) return;

    smp.destroy();
  };

  const byType = (type: string) => (smp: Sample) => smp.metadata.type === type;
  const wormSamples = sample.samples.filter(byType('worms'));

  function getList() {
    if (!wormSamples.length)
      return (
        <InfoBackgroundMessage>
          You have not added any entries yet
        </InfoBackgroundMessage>
      );

    const getSamplePhoto = (smp: Sample) => {
      const pic = smp.media[0]?.getURL();

      const photo = pic ? (
        <img src={pic} className="h-full object-cover" />
      ) : (
        <IonIcon icon={worm} className="size-7" />
      );

      return <div className="list-avatar m-1">{photo}</div>;
    };

    const getEntry = (wormSample: Sample) => {
      const count = wormSample.attrs[wormCountAttr.id] || 0;
      return (
        <IonItemSliding key={wormSample.cid}>
          <IonItem
            routerLink={`${url}/${wormSample.cid}`}
            detail
            className="[--padding-start:0]"
          >
            <div className="flex w-full items-center gap-2">
              {getSamplePhoto(wormSample)}
              <div className="flex w-full justify-between gap-2">
                <h3>{wormSample.getPrettyName()}</h3>
                {count > 0 && <Badge>{`${count}`}</Badge>}
              </div>
            </div>
          </IonItem>

          {!isDisabled && (
            <IonItemOptions side="end">
              <IonItemOption
                color="danger"
                onClick={() => onSampleDelete(wormSample)}
              >
                Delete
              </IonItemOption>
            </IonItemOptions>
          )}
        </IonItemSliding>
      );
    };

    return (
      <IonList className="traps-list" lines="full">
        <div className="rounded-list">
          <div className="list-divider">
            <div>Entries</div>
            <div>{wormSamples.length}</div>
          </div>
          {wormSamples.map(getEntry)}
        </div>
      </IonList>
    );
  }

  const reachedMax = wormSamples.length >= 10;

  return (
    <Page id="survey-soil-worms">
      <Header title="Earthworms" />
      <Main>
        <InfoMessage color="tertiary" className="mx-3">
          <ul className="list-disc pl-4 pr-2">
            <ExpandableList
              maxItems={2}
              className="[&>li]:my-1 [&>li]:font-light"
            >
              <li>5-10 samples should be taken per field.</li>
              <li>
                As a rule of thumb the size of sampling area would not be
                greater than 4 hectares.
              </li>
              <li>
                Sampling should take place in spring and/or autumn when
                conditions are not dry.
              </li>
              <li>
                At each point dig out a pit (20cm x 20cm x 20cm) and place soil
                on a plastic sheet.
              </li>
              <li>
                The soil should be hand-sorted placing earthworms in a
                container.
              </li>
              <li>Count and record the total number of earthworms.</li>
              <li>Return earthworms to the soil.</li>
            </ExpandableList>
          </ul>
        </InfoMessage>

        <IonList lines="full" className="mt-8">
          {!isDisabled && !reachedMax && (
            <Button
              onPress={onAddNewSample}
              color="secondary"
              prefix={<IonIcon icon={addOutline} className="size-6" />}
              className="mx-auto mb-8"
            >
              Add sample
            </Button>
          )}

          <div className="rounded-list">{getList()}</div>
        </IonList>
      </Main>
    </Page>
  );
};

export default observer(WormList);
