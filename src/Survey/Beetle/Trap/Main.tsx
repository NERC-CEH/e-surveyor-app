import { FC } from 'react';
import { observer } from 'mobx-react';
import {
  bookOutline,
  cameraOutline,
  locationOutline,
  openOutline,
} from 'ionicons/icons';
import { useRouteMatch } from 'react-router';
import { Button, Main, MenuAttrItem, MenuAttrItemFromModel } from '@flumens';
import { IonList, IonIcon, IonLabel, IonItem } from '@ionic/react';
import SegmentInput from 'common/Components/SegmentInput';
import Sample from 'models/sample';
import SinglePhotoPicker from 'Components/PhotoPickers/SinglePhotoPicker';
import GridRefValue from 'Survey/common/Components/GridRefValue';
import SpeciesList from 'Survey/common/Components/SpeciesList';
import { marginOptions } from '../config';
import './styles.scss';

type Props = {
  subSample: Sample;
  onAddNewSpecies: () => void;
  isDisabled: boolean;
};

const TrapMain: FC<Props> = ({ subSample, onAddNewSpecies, isDisabled }) => {
  const { url } = useRouteMatch();

  const prettyGridRef = <GridRefValue sample={subSample} />;

  return (
    <>
      <Main>
        <IonList lines="full">
          <div className="rounded">
            <IonItem
              href="https://www.rothamsted.ac.uk/sites/default/files/How%20to%20pitfall%20trap%20on%20your%20farm.pdf"
              detail
              detailIcon={openOutline}
            >
              <IonIcon icon={bookOutline} size="small" slot="start" />
              <IonLabel class="ion-text-wrap">
                Click here for the guidance documents.
              </IonLabel>
            </IonItem>
          </div>
        </IonList>

        <IonList lines="full">
          <div className="rounded">
            <SinglePhotoPicker
              label="Trap photo"
              model={subSample}
              disabled // we want to upload the original pic with the detected objects
            />
            <MenuAttrItem
              routerLink={`${url}/map`}
              value={prettyGridRef}
              icon={locationOutline}
              label="Location"
              skipValueTranslation
              disabled={isDisabled}
            />

            <SegmentInput
              options={marginOptions}
              value={subSample.attrs.margin}
              onChange={(value: any) => {
                subSample.attrs.margin = value; // eslint-disable-line
                subSample.save();
              }}
              disabled={isDisabled}
            />

            <MenuAttrItemFromModel attr="comment" model={subSample} />
          </div>
        </IonList>

        <SpeciesList sample={subSample} isDisabled={isDisabled} disableAI />

        {!isDisabled && (
          <Button
            onPress={onAddNewSpecies}
            color="secondary"
            startAddon={
              <IonIcon slot="start" icon={cameraOutline} className="size-6" />
            }
            className="mx-auto my-4"
          >
            Add species
          </Button>
        )}
      </Main>
    </>
  );
};

export default observer(TrapMain);
