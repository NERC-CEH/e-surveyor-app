/* eslint-disable no-param-reassign */
import { observer } from 'mobx-react';
import { Page, Header, Main, Block } from '@flumens';
import { IonList } from '@ionic/react';
import Sample from 'models/sample';
import {
  CROP_OTHER_VALUE,
  LAND_USE_OTHER_VALUE,
  coverCropAttr,
  coverCropOtherAttr,
  cropAttr,
  cropOtherAttr,
  landUseAttr,
  landUseOtherAttr,
  prevCrop1Attr,
  prevCrop2Attr,
  prevCrop3Attr,
  tillageAttr,
} from './config';

interface Props {
  sample: Sample;
}

const Management = ({ sample }: Props) => {
  // const { url } = useRouteMatch();
  const hasLandUseOther =
    !!sample.attrs?.[landUseAttr.id]?.includes(LAND_USE_OTHER_VALUE);
  const hasCropOther =
    !!sample.attrs?.[cropAttr().id]?.includes(CROP_OTHER_VALUE);
  const hasCoverCropOther =
    !!sample.attrs?.[coverCropAttr.id]?.includes(CROP_OTHER_VALUE);

  const recordAttrs = {
    record: sample.attrs,
    isDisabled: sample.isDisabled(),
  };

  return (
    <Page id="survey-soil-management">
      <Header title="Management" />
      <Main>
        <IonList lines="full">
          <div className="rounded-list">
            <Block block={landUseAttr} {...recordAttrs} />
            {hasLandUseOther && (
              <Block block={landUseOtherAttr} {...recordAttrs} />
            )}

            <Block block={cropAttr(sample.attrs)} {...recordAttrs} />
            {hasCropOther && <Block block={cropOtherAttr} {...recordAttrs} />}

            <Block block={prevCrop1Attr(sample.attrs)} {...recordAttrs} />
            <Block block={prevCrop2Attr(sample.attrs)} {...recordAttrs} />
            <Block block={prevCrop3Attr(sample.attrs)} {...recordAttrs} />

            <Block block={coverCropAttr} {...recordAttrs} />
            {hasCoverCropOther && (
              <Block block={coverCropOtherAttr} {...recordAttrs} />
            )}

            <Block block={tillageAttr} {...recordAttrs} />
          </div>
        </IonList>
      </Main>
    </Page>
  );
};

export default observer(Management);
