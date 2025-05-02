import { useState } from 'react';
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
import InfoBackgroundMessage from 'common/Components/InfoBackgroundMessage';
import beetleIcon from 'common/images/beetle.svg';
import Sample from 'models/sample';
import SinglePhotoPicker from 'Components/PhotoPickers/SinglePhotoPicker';
import GridRefValue from 'Survey/common/Components/GridRefValue';
import SpeciesList from 'Survey/common/Components/SpeciesList';
import BeetleGuide from '../common/BeetleGuide';
import { marginOptions } from '../config';
import './styles.scss';

type Props = {
  subSample: Sample;
  onAddNewSpecies: () => void;
  isDisabled: boolean;
};

const TrapMain = ({ subSample, onAddNewSpecies, isDisabled }: Props) => {
  const { url } = useRouteMatch();
  const [showGuide, setShowGuide] = useState(false);

  const prettyGridRef = <GridRefValue sample={subSample} />;

  return (
    <>
      <Main>
        <div className="mt-2 flex flex-col pb-5">
          <IonList lines="full">
            <Button
              href="https://www.rothamsted.ac.uk/sites/default/files/How%20to%20pitfall%20trap%20on%20your%20farm.pdf"
              prefix={<IonIcon icon={bookOutline} size="small" />}
              suffix={<IonIcon icon={openOutline} size="small" />}
              className="text-left"
            >
              Click here for the guidance documents.
            </Button>

            <Button
              prefix={<IonIcon icon={beetleIcon} className="size-6" />}
              className="mt-1 w-full text-left"
              onPress={() => setShowGuide(true)}
            >
              Carabid identification guide
            </Button>

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
            <SpeciesList
              sample={subSample}
              isDisabled={isDisabled}
              disableAI
              disableDelete
              useSpeciesProfile
            />

            {!subSample.occurrences.length && (
              <InfoBackgroundMessage>
                Your species list is empty. <br /> Tap the orange species button
                to add your first beetle.
              </InfoBackgroundMessage>
            )}

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

      <BeetleGuide isOpen={showGuide} onClose={() => setShowGuide(false)} />
    </>
  );
};

export default observer(TrapMain);
