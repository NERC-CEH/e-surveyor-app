import { useContext } from 'react';
import { observer } from 'mobx-react';
import { addCircleOutline, locationOutline } from 'ionicons/icons';
import { useRouteMatch } from 'react-router';
import { Main, MenuAttrItem, Button } from '@flumens';
import { IonList, IonIcon, NavContext } from '@ionic/react';
import InfoBackgroundMessage from 'common/Components/InfoBackgroundMessage';
import Sample from 'models/sample';
import PhotoPicker from 'Components/PhotoPickers/PhotoPicker';
import GridRefValue from 'Survey/common/Components/GridRefValue';
import SpeciesList from 'Survey/common/Components/SpeciesList';
import './styles.scss';

type Props = {
  subSample: Sample;
  photoSelect: () => void;
  isDisabled: boolean;
};

const QuadratMain = ({ subSample, photoSelect, isDisabled }: Props) => {
  const { navigate } = useContext(NavContext);
  const { url } = useRouteMatch();

  const navigateToSearch = () => navigate(`${url}/taxon`);

  const getNewImageButton = () => {
    if (isDisabled) {
      return <br />;
    }

    return (
      <Button
        color="secondary"
        onLongPress={navigateToSearch}
        onPress={photoSelect}
        prefix={<IonIcon icon={addCircleOutline} className="size-6" />}
        className="mx-auto my-5"
      >
        Species
      </Button>
    );
  };

  const prettyGridRef = <GridRefValue sample={subSample} />;

  return (
    <>
      <Main>
        <IonList lines="full">
          <br />
          <div className="rounded-list">
            <MenuAttrItem
              routerLink={`${url}/map`}
              value={prettyGridRef}
              icon={locationOutline}
              label="Location"
              skipValueTranslation
              disabled={isDisabled}
            />
          </div>

          <h3 className="list-title">Quadrat photo</h3>
          <div className="rounded-list">
            <PhotoPicker
              model={subSample}
              maxImages={1}
              allowToCrop
              placeholderCount={0}
            />
          </div>
        </IonList>

        {getNewImageButton()}

        <SpeciesList
          sample={subSample}
          isDisabled={isDisabled}
          useSpeciesProfile
        />

        {!subSample.occurrences.length && (
          <InfoBackgroundMessage>
            Your species list is empty. <br /> Hold down the orange species
            button to list plant species yourself, or tap to take a photo for
            the AI to identify.
          </InfoBackgroundMessage>
        )}
      </Main>
    </>
  );
};

export default observer(QuadratMain);
