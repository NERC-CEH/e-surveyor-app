import { observer } from 'mobx-react';
import { useRouteMatch } from 'react-router';
import { Main, Block, MenuAttrItem } from '@flumens';
import beetleIcon from 'common/images/beetle.svg';
import Occurrence from 'models/occurrence';
import PhotoPicker from 'Components/PhotoPickers/PhotoPicker';
import { occurrenceAbundanceAttr } from 'Survey/common/config';
import { occurrenceCommentAttr } from '../config';

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
      <div className="m-2.5 flex flex-col gap-4 pb-5">
        <div className="rounded-list">
          <div className="list-divider">Photos</div>
          <PhotoPicker model={occurrence} />
        </div>

        <div className="rounded-list">
          <div className="list-divider">Species Details</div>
          <MenuAttrItem
            routerLink={`${url}/species`}
            value={speciesName}
            icon={beetleIcon}
            label="Species"
            skipValueTranslation
            disabled={isDisabled}
            lines="full"
          />

          <Block block={occurrenceAbundanceAttr} {...recordAttrs} />

          <Block block={occurrenceCommentAttr} {...recordAttrs} />
        </div>
      </div>
    </Main>
  );
};

export default observer(OccurrenceMain);
