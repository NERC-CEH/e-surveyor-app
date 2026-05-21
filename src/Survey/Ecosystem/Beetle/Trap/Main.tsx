import { useState, useContext } from 'react';
import { observer } from 'mobx-react';
import {
  bookOutline,
  cameraOutline,
  locationOutline,
  openOutline,
} from 'ionicons/icons';
import { useRouteMatch } from 'react-router';
import { Block, Button, Main, MenuAttrItem } from '@flumens';
import { IonList, IonIcon, NavContext } from '@ionic/react';
import InfoBackgroundMessage from 'common/Components/InfoBackgroundMessage';
import beetleIcon from 'common/images/beetle.svg';
import Sample from 'models/sample';
import SinglePhotoPicker from 'Components/PhotoPickers/SinglePhotoPicker';
import GridRefValue from 'Survey/common/Components/GridRefValue';
import SpeciesList from 'Survey/common/Components/SpeciesList';
import BeetleGuide from '../common/BeetleGuide';
import { trapCommentAttr, trapMarginAttr } from '../config';
import './styles.scss';

type Props = {
  subSample: Sample;
  onAddNewSpecies: () => void;
  isDisabled: boolean;
};

const TrapMain = ({ subSample, onAddNewSpecies, isDisabled }: Props) => {
  const { url } = useRouteMatch();
  const { navigate } = useContext(NavContext);
  const [showGuide, setShowGuide] = useState(false);

  const prettyGridRef = <GridRefValue sample={subSample} />;

  const recordAttrs = { isDisabled, record: subSample.data };

  const navigateToOccurrence = (model: any) => {
    if (isDisabled) return;
    navigate(`${url}/occurrence/${model.cid}`);
  };

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
              <SinglePhotoPicker label="Trap photo" model={subSample} />
              <MenuAttrItem
                routerLink={`${url}/map`}
                value={prettyGridRef}
                icon={locationOutline}
                label="Location"
                skipValueTranslation
                disabled={isDisabled}
              />

              <Block block={trapMarginAttr} {...recordAttrs} />
              <Block block={trapCommentAttr} {...recordAttrs} />
            </div>
          </IonList>

          {!isDisabled && (
            <Button
              onPress={onAddNewSpecies}
              color="secondary"
              prefix={<IonIcon icon={cameraOutline} className="size-6" />}
              className="mx-auto my-10 bg-secondary-600"
            >
              Add species
            </Button>
          )}

          {!subSample.occurrences.length && (
            <InfoBackgroundMessage className="mt-4">
              Your species list is empty. <br /> Tap the orange species button
              to add your first beetle.
            </InfoBackgroundMessage>
          )}

          {!!subSample.occurrences.length && (
            <div className="flex flex-col gap-5">
              <SpeciesList
                sample={subSample}
                isDisabled={isDisabled}
                disableAI
                onOccurrenceClick={navigateToOccurrence}
                useNumberedList
              />
            </div>
          )}
        </div>
      </Main>

      <BeetleGuide isOpen={showGuide} onClose={() => setShowGuide(false)} />
    </>
  );
};

export default observer(TrapMain);
