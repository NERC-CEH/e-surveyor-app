/* eslint-disable no-param-reassign */
import { useContext } from 'react';
import { observer } from 'mobx-react';
import { addOutline, flaskOutline } from 'ionicons/icons';
import { useRouteMatch } from 'react-router';
import { Page, Header, Main, Button, Block } from '@flumens';
import {
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  NavContext,
} from '@ionic/react';
import InfoBackgroundMessage from 'common/Components/InfoBackgroundMessage';
import { useEntryDeleteConfirmation } from 'common/helpers/hooks';
import Sample from 'models/sample';
import {
  SOMDepthAttr,
  SOMDiameterAttr,
  SOMIDAttr,
  SOMPatternAttr,
} from '../config';
import soil from '../soil.svg';

interface Props {
  sample: Sample;
}

const SOMList = ({ sample }: Props) => {
  const { url } = useRouteMatch();
  const { navigate } = useContext(NavContext);
  const confirmEntryDeletion = useEntryDeleteConfirmation();

  const isDisabled = sample.isDisabled();
  const onAddNewSample = () => {
    const survey = sample.getSurvey();
    const somSample = survey.smp!.create!({ Sample, type: 'som' });
    somSample.attrs[SOMIDAttr.id] = `${Date.now()}`.substring(4);
    sample.samples.push(somSample);

    navigate(`${url}/${somSample.cid}`);
  };

  const onSampleDelete = async (smp: Sample) => {
    const shouldDelete = await confirmEntryDeletion();
    if (!shouldDelete) return;

    smp.destroy();
  };

  const byType = (type: string) => (smp: Sample) => smp.metadata.type === type;
  const somSamples = sample.samples.filter(byType('som'));

  function getList() {
    if (!somSamples.length)
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
        <IonIcon icon={soil} className="size-7" />
      );

      return <div className="list-avatar m-1">{photo}</div>;
    };

    const getEntry = (somSample: Sample) => {
      return (
        <IonItemSliding key={somSample.cid}>
          <IonItem
            routerLink={`${url}/${somSample.cid}`}
            detail
            className="[--padding-start:0]"
          >
            <div className="flex w-full items-center gap-2">
              {getSamplePhoto(somSample)}
              <div className="flex w-full justify-between gap-2">
                <h3>{somSample.getPrettyName()}</h3>
              </div>
            </div>
          </IonItem>

          {!isDisabled && (
            <IonItemOptions side="end">
              <IonItemOption
                color="danger"
                onClick={() => onSampleDelete(somSample)}
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
            <div>{somSamples.length}</div>
          </div>
          {somSamples.map(getEntry)}
        </div>
      </IonList>
    );
  }

  const recordAttrs = {
    record: sample.attrs,
    isDisabled: sample.isDisabled(),
  };

  return (
    <Page id="survey-soil-som">
      <Header title="SOM" />
      <Main>
        <IonList lines="full" className="mt-8">
          <div className="rounded-list">
            <Block block={SOMPatternAttr} {...recordAttrs} />
            <Block block={SOMDepthAttr} {...recordAttrs} />
            <Block block={SOMDiameterAttr} {...recordAttrs} />

            <IonItem routerLink={`${url}/lab`} detail>
              <IonIcon src={flaskOutline} slot="start" />
              <IonLabel>Lab results</IonLabel>
            </IonItem>
          </div>
        </IonList>

        <div className="mt-8">
          {!isDisabled && (
            <Button
              onPress={onAddNewSample}
              color="secondary"
              prefix={<IonIcon icon={addOutline} className="size-6" />}
              className="mx-auto mb-8"
            >
              Add sample
            </Button>
          )}

          {getList()}
        </div>
      </Main>
    </Page>
  );
};

export default observer(SOMList);
