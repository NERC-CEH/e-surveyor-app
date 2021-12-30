import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { IonItemDivider, IonList } from '@ionic/react';
import { locationOutline } from 'ionicons/icons';
import { Main, MenuAttrItem } from '@flumens';
import GridRefValue from 'Survey/common/Components/GridRefValue';
import transectIcon from 'common/images/transectIconBlack.svg';
import { useRouteMatch } from 'react-router-dom';
import Sample from 'models/sample';
import Seeds from 'common/images/seeds.svg';
import squareIcon from './square.svg';
import habitatIcon from './habitats.svg';
import stepsIcon from './steps.svg';

type Props = {
  sample: typeof Sample;
  isDisabled?: boolean;
};

const MainComponent: FC<Props> = ({ sample, isDisabled }) => {
  const match = useRouteMatch();

  const { type, seedmixgroup, seedmix, quadratSize, steps, habitat } =
    sample.attrs;
  const { completedDetails } = sample.metadata;

  const prettyGridRef = <GridRefValue sample={sample} />;

  const isCustom = type === 'Custom';

  return (
    <Main>
      <IonList lines="full">
        <div className="rounded">
          <MenuAttrItem
            routerLink={`${match.url}/map`}
            value={prettyGridRef}
            icon={locationOutline}
            label="Location"
            skipValueTranslation
            disabled={isDisabled}
          />
        </div>

        <IonItemDivider mode="ios">Survey</IonItemDivider>
        <div className="rounded">
          <MenuAttrItem
            routerLink={`${match.url}/type`}
            value={type || ''}
            icon={transectIcon}
            label="Type"
            skipValueTranslation
            disabled={isDisabled || completedDetails}
          />
          <MenuAttrItem
            routerLink={`${match.url}/steps`}
            value={steps || ''}
            icon={stepsIcon}
            label="Steps"
            skipValueTranslation
            disabled={isDisabled || !isCustom || completedDetails}
          />

          <MenuAttrItem
            routerLink={`${match.url}/quadratSize`}
            value={!!quadratSize && `${quadratSize}m`}
            icon={squareIcon}
            label="Quadrat size"
            skipValueTranslation
            disabled={isDisabled || !isCustom || completedDetails}
          />
          {!isCustom && (
            <MenuAttrItem
              routerLink={`${match.url}/habitat`}
              value={habitat || ''}
              icon={habitatIcon}
              label="Habitat"
              skipValueTranslation
              disabled={isDisabled}
            />
          )}
        </div>

        <IonItemDivider mode="ios">
          <span>
            Seed mix (<i>optional</i>)
          </span>
        </IonItemDivider>
        <div className="rounded">
          <MenuAttrItem
            routerLink={`${match.url}/seedmixgroup`}
            icon={Seeds}
            label="Supplier"
            value={seedmixgroup || ''}
            disabled={isDisabled}
          />
          <MenuAttrItem
            routerLink={`${match.url}/seedmix`}
            icon={Seeds}
            label="Name"
            value={seedmix || ''}
            // styles="opacity:0.8"
            disabled={!seedmixgroup || isDisabled}
          />
        </div>
      </IonList>
    </Main>
  );
};

export default observer(MainComponent);
