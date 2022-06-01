import { FC, useContext } from 'react';
import { observer } from 'mobx-react';
import { useRouteMatch } from 'react-router';
import Sample from 'models/sample';
import { IonItemDivider, IonList, IonIcon, NavContext } from '@ionic/react';
import { camera, locationOutline } from 'ionicons/icons';
import { Main, MenuAttrItem, LongPressButton } from '@flumens';
import PhotoPicker from 'common/Components/PhotoPicker';
import GridRefValue from 'Survey/common/Components/GridRefValue';
import SpeciesList from 'Survey/common/Components/SpeciesList';

import './styles.scss';

type Props = {
  subSample: Sample;
  photoSelect: () => void;
  isDisabled: boolean;
};

const QuadratMain: FC<Props> = ({ subSample, photoSelect, isDisabled }) => {
  const { navigate } = useContext(NavContext);
  const { url } = useRouteMatch();

  const navigateToSearch = () => navigate(`${url}/taxon`);

  const getNewImageButton = () => {
    if (isDisabled) {
      return <br />;
    }

    return (
      <LongPressButton
        color="secondary"
        onLongClick={navigateToSearch}
        type="submit"
        expand="block"
        onClick={photoSelect}
      >
        <IonIcon slot="start" icon={camera} size="large" />
        Plant
      </LongPressButton>
    );
  };

  const prettyGridRef = <GridRefValue sample={subSample} />;

  return (
    <>
      <Main>
        <IonList lines="full">
          <br />
          <div className="rounded">
            <MenuAttrItem
              routerLink={`${url}/map`}
              value={prettyGridRef}
              icon={locationOutline}
              label="Location"
              skipValueTranslation
              disabled={isDisabled}
            />
          </div>

          <IonItemDivider mode="ios">Quadrat photo</IonItemDivider>
          <div className="rounded">
            <PhotoPicker
              model={subSample}
              maxImages={1}
              allowToCrop
              placeholderCount={0}
            />
          </div>
        </IonList>

        {getNewImageButton()}

        <SpeciesList sample={subSample} isDisabled={isDisabled} />
      </Main>
    </>
  );
};

export default observer(QuadratMain);
