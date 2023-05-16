import { FC } from 'react';
import { observer } from 'mobx-react';
import { addCircleOutline, locationOutline } from 'ionicons/icons';
import { useRouteMatch } from 'react-router';
import { Main, MenuAttrItem, MenuAttrItemFromModel } from '@flumens';
import { IonList, IonIcon, IonButton } from '@ionic/react';
import SegmentInput from 'common/Components/SegmentInput';
import Sample from 'models/sample';
import SinglePhotoPicker from 'Components/PhotoPickers/SinglePhotoPicker';
import GridRefValue from 'Survey/common/Components/GridRefValue';
import SpeciesList from 'Survey/common/Components/SpeciesList';
import './styles.scss';

type Props = {
  subSample: Sample;
  onAddNewSpecies: () => void;
  isDisabled: boolean;
};

const TrapMain: FC<Props> = ({ subSample, onAddNewSpecies, isDisabled }) => {
  const { url } = useRouteMatch();

  const getNewSpeciesBtn = () => {
    if (isDisabled) return <br />;

    return (
      <IonButton
        color="secondary"
        type="submit"
        expand="block"
        onClick={onAddNewSpecies}
      >
        <IonIcon slot="start" icon={addCircleOutline} size="large" />
        Species
      </IonButton>
    );
  };

  const prettyGridRef = <GridRefValue sample={subSample} />;

  const marginOptions = [
    { value: 'Edge' },
    { value: '5 meters in' },
    { value: 'Centre' },
  ];

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

            <SegmentInput
              options={marginOptions}
              value={subSample.attrs.margin}
              onChange={console.log}
            />

            <MenuAttrItemFromModel attr="comment" model={subSample} />

            <SinglePhotoPicker
              label="Trap photo"
              model={subSample}
              allowToCrop
            />
          </div>
        </IonList>

        <SpeciesList sample={subSample} isDisabled={isDisabled} />

        {getNewSpeciesBtn()}
      </Main>
    </>
  );
};

export default observer(TrapMain);
