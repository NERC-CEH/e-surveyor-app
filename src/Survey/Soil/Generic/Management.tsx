import { observer } from 'mobx-react';
import { Page, Header, Main, Block, useSample } from '@flumens';
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
  prevCoverCropAttr,
  prevCrop1Attr,
  prevCrop2Attr,
  prevOverCropOtherAttr,
  tillageAttr,
} from './config';

const Management = () => {
  const { sample } = useSample<Sample>();
  if (!sample) throw new Error('Sample is missing');

  // const { url } = useRouteMatch();
  const hasLandUseOther =
    !!sample.data?.[landUseAttr.id]?.includes(LAND_USE_OTHER_VALUE);
  const hasCropOther =
    !!sample.data?.[cropAttr().id]?.includes(CROP_OTHER_VALUE);
  const hasCoverCropOther =
    !!sample.data?.[coverCropAttr.id]?.includes(CROP_OTHER_VALUE);
  const hasPrevCoverCropOther =
    !!sample.data?.[prevCoverCropAttr.id]?.includes(CROP_OTHER_VALUE);

  const recordAttrs = { record: sample.data };

  return (
    <Page id="survey-soil-management" className="theme-soil">
      <Header title="Management" />
      <Main>
        <div className="list">
          <div className="rounded-list">
            <Block block={landUseAttr} {...recordAttrs} />
            {hasLandUseOther && (
              <Block block={landUseOtherAttr} {...recordAttrs} />
            )}

            <Block block={cropAttr(sample.data)} {...recordAttrs} />
            {hasCropOther && <Block block={cropOtherAttr} {...recordAttrs} />}

            <Block block={prevCrop1Attr(sample.data)} {...recordAttrs} />
            <Block block={prevCrop2Attr(sample.data)} {...recordAttrs} />
          </div>

          <div className="rounded-list">
            <Block block={coverCropAttr} {...recordAttrs} />
            {hasCoverCropOther && (
              <Block block={coverCropOtherAttr} {...recordAttrs} />
            )}
            <Block block={prevCoverCropAttr} {...recordAttrs} />
            {hasPrevCoverCropOther && (
              <Block block={prevOverCropOtherAttr} {...recordAttrs} />
            )}
          </div>

          <div className="rounded-list">
            <Block block={tillageAttr} {...recordAttrs} />
          </div>
        </div>
      </Main>
    </Page>
  );
};

export default observer(Management);
