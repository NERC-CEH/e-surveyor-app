import { observer } from 'mobx-react';
import { useRouteMatch } from 'react-router';
import { Main, Block, MenuAttrItem } from '@flumens';
import { IonList } from '@ionic/react';
import beetleIcon from 'common/images/beetle.svg';
import Occurrence from 'models/occurrence';
import PhotoPicker from 'Components/PhotoPickers/PhotoPicker';
import { occurrenceCommentAttr, occurrenceAbundanceAttr } from '../config';

type Props = {
  occurrence: Occurrence;
  isDisabled: boolean;
};

const OccurrenceMain = ({ occurrence, isDisabled }: Props) => {
  const { url } = useRouteMatch();

  const recordAttrs = { isDisabled, record: occurrence.data };

  const species = occurrence.getSpecies();
  const speciesName =
    species?.scientificName || species?.commonName || 'Not identified';

  return (
    <Main>
      <div className="mt-2 flex flex-col pb-5">
        <IonList lines="full">
          <h3 className="list-title">Photos</h3>
          <div className="rounded-list">
            <PhotoPicker model={occurrence} />
          </div>

          <h3 className="list-title">Species Details</h3>
          <div className="rounded-list">
            <MenuAttrItem
              routerLink={`${url}/species`}
              value={speciesName}
              icon={beetleIcon}
              label="Species"
              skipValueTranslation
              disabled={isDisabled}
            />

            <Block block={occurrenceAbundanceAttr} {...recordAttrs} />

            <Block block={occurrenceCommentAttr} {...recordAttrs} />
          </div>
        </IonList>
      </div>
    </Main>
  );
};

export default observer(OccurrenceMain);
