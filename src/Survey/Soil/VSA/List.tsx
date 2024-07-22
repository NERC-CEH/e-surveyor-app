/* eslint-disable no-param-reassign */
import { useContext } from 'react';
import { observer } from 'mobx-react';
import { addOutline } from 'ionicons/icons';
import { useRouteMatch } from 'react-router';
import { Page, Header, Main, Button } from '@flumens';
import {
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonList,
  NavContext,
} from '@ionic/react';
import InfoBackgroundMessage from 'common/Components/InfoBackgroundMessage';
import { useEntryDeleteConfirmation } from 'common/helpers/hooks';
import Sample from 'models/sample';
import field from '../field.svg';

interface Props {
  sample: Sample;
}

const VSAList = ({ sample }: Props) => {
  const { url } = useRouteMatch();
  const { navigate } = useContext(NavContext);
  const confirmEntryDeletion = useEntryDeleteConfirmation();

  const isDisabled = sample.isDisabled();
  const onAddNewSample = () => {
    const survey = sample.getSurvey();
    const vsaSample = survey.smp!.create!({ Sample, type: 'vsa' });
    sample.samples.push(vsaSample);

    navigate(`${url}/${vsaSample.cid}`);
  };

  const onSampleDelete = async (smp: Sample) => {
    const shouldDelete = await confirmEntryDeletion();
    if (!shouldDelete) return;

    smp.destroy();
  };

  const byType = (type: string) => (smp: Sample) => smp.metadata.type === type;
  const vsaSamples = sample.samples.filter(byType('vsa'));

  function getList() {
    if (!vsaSamples.length)
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
        <IonIcon icon={field} className="size-7" />
      );

      return <div className="list-avatar m-1">{photo}</div>;
    };

    const getEntry = (vsaSample: Sample) => {
      return (
        <IonItemSliding key={vsaSample.cid}>
          <IonItem
            routerLink={`${url}/${vsaSample.cid}`}
            detail
            className="[--padding-start:0]"
          >
            <div className="flex w-full items-center gap-2">
              {getSamplePhoto(vsaSample)}
              <div className="flex w-full justify-between gap-2">
                <h3>{vsaSample.getPrettyName()}</h3>
              </div>
            </div>
          </IonItem>

          {!isDisabled && (
            <IonItemOptions side="end">
              <IonItemOption
                color="danger"
                onClick={() => onSampleDelete(vsaSample)}
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
            <div>{vsaSamples.length}</div>
          </div>
          {vsaSamples.map(getEntry)}
        </div>
      </IonList>
    );
  }

  return (
    <Page id="survey-soil-vsa">
      <Header title="VSA" />
      <Main>
        <IonList lines="full" className="mt-8">
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

          <div className="rounded-list">{getList()}</div>
        </IonList>
      </Main>
    </Page>
  );
};

export default observer(VSAList);
