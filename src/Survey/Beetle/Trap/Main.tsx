import { FC, useContext } from 'react';
import { observer } from 'mobx-react';
import { addCircleOutline, locationOutline } from 'ionicons/icons';
import { useRouteMatch } from 'react-router';
import { Main, MenuAttrItem, LongPressButton, Occurrence } from '@flumens';
import {
  IonItemDivider,
  IonList,
  IonIcon,
  NavContext,
  IonItem,
} from '@ionic/react';
import PhotoPicker from 'common/Components/PhotoPicker';
import Sample from 'models/sample';
import GridRefValue from 'Survey/common/Components/GridRefValue';
// import SpeciesList from 'Survey/common/Components/SpeciesList';
import './styles.scss';

type Props = {
  subSample: Sample;
  photoSelect: () => void;
  isDisabled: boolean;
};

const TrapMain: FC<Props> = ({ subSample, photoSelect, isDisabled }) => {
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
        <IonIcon slot="start" icon={addCircleOutline} size="large" />
        Species
      </LongPressButton>
    );
  };

  const getSpecies = () => {
    const getSpeciesEntry = (occ: Occurrence, index: number) => (
      <IonItem>
        <div className="mr-5 h-6 w-6">
          <img src={occ.media?.[0].getURL()} alt="" />
        </div>

        <div>#{index + 1}</div>
      </IonItem>
    );

    return subSample.occurrences.map(getSpeciesEntry);
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

            <div className="rounded">
              <div className="rounded-md bg-white p-2 text-sm">WIP</div>
            </div>
          </div>

          <IonItemDivider mode="ios">Trap photo</IonItemDivider>
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

        {getSpecies()}

        {/* <SpeciesList sample={subSample} isDisabled={isDisabled} /> */}
      </Main>
    </>
  );
};

export default observer(TrapMain);
