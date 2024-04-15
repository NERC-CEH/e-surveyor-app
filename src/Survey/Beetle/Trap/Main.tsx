import { FC } from 'react';
import { observer } from 'mobx-react';
import {
  bookOutline,
  cameraOutline,
  locationOutline,
  openOutline,
} from 'ionicons/icons';
import { useRouteMatch } from 'react-router';
import { Button, Input, Main, MenuAttrItem, Select } from '@flumens';
import { IonList, IonIcon } from '@ionic/react';
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
    <Main>
      <div className="flex flex-col pb-5">
        <Button
          href="https://www.rothamsted.ac.uk/sites/default/files/How%20to%20pitfall%20trap%20on%20your%20farm.pdf"
          prefix={<IonIcon icon={bookOutline} size="small" />}
          suffix={<IonIcon icon={openOutline} size="small" />}
          className="mx-3 text-left"
        >
          Click here for the guidance documents.
        </Button>

        <IonList lines="full">
          <h3 className="list-title">Details</h3>
          <div className="rounded-list">
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
            {/* <div className="border-b-[0.5px] border-neutral-200 bg-white">
              <div className="bg-neutral-50/50 p-1">
                <RadioInput
                  options={marginOptions}
                  value={subSample.attrs.margin}
                  onChange={(value: any) => (subSample.attrs.margin = value)} // eslint-disable-line
                  icon={false}
                  size="small"
                  inline
                />
              </div>
            </div> */}
            <Select
              label="Position"
              options={marginOptions}
              value={subSample.attrs.margin}
              onChange={(value: any) => (subSample.attrs.margin = value)} // eslint-disable-line
              prefix={<IonIcon icon={locationOutline} className="size-6" />}
            />
            <Input
              label="Notes"
              labelPlacement="floating"
              value={subSample.attrs.comment}
              onChange={(value: any) => (subSample.attrs.comment = value)} // eslint-disable-line
              isMultiline
            />
          </div>
        </IonList>

        <h3 className="list-title px-3">Species</h3>
        <div className="flex flex-col gap-5">
          <SpeciesList sample={subSample} isDisabled={isDisabled} disableAI />

          {!isDisabled && (
            <Button
              onPress={onAddNewSpecies}
              color="secondary"
              prefix={<IonIcon icon={cameraOutline} className="size-6" />}
              className="mx-auto"
            >
              Add species
            </Button>
          )}
        </div>
      </div>
    </Main>
  );
};

export default observer(TrapMain);
