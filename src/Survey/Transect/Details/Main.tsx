import { observer } from 'mobx-react';
import { locationOutline, informationCircleOutline } from 'ionicons/icons';
import { useRouteMatch } from 'react-router-dom';
import { Main, MenuAttrItem, InfoMessage, InfoButton } from '@flumens';
import { IonIcon, IonList } from '@ionic/react';
import Seeds from 'common/images/seeds.svg';
import transectIcon from 'common/images/transectIconBlack.svg';
import transectWShape from 'common/images/transectWShape.jpg';
import Sample from 'models/sample';
import GridRefValue from 'Survey/common/Components/GridRefValue';
import habitatIcon from './habitats.svg';
import squareIcon from './square.svg';
import stepsIcon from './steps.svg';

type Props = {
  sample: Sample;
  isDisabled?: boolean;
};

const MainComponent = ({ sample, isDisabled }: Props) => {
  const match = useRouteMatch();

  const { type, seedmixgroup, seedmix, quadratSize, steps, habitat } =
    sample.attrs;
  const { completedDetails } = sample.metadata;

  const prettyGridRef = <GridRefValue sample={sample} />;

  const isCustom = type === 'Custom';

  return (
    <Main>
      <InfoMessage
        prefix={<IonIcon src={informationCircleOutline} className="size-6" />}
        color="tertiary"
        className="m-2"
      >
        How to set up a transect?
        <InfoButton color="dark" label="READ MORE" header="Tips">
          <div>
            <p>
              Start by telling the app where you are doing the survey (your
              location). The app can pick up on your current location using your
              phone's GPS, but if you want to survey somewhere else, you can do
              this by clicking on the right arrow and using the map to choose
              your location.
            </p>
            <p>Then, select which type of survey you plan to do. </p>
            <p>
              This could be a survey with preexisting protocols, or a "custom"
              survey that allows you to choose how often you will stop (how many
              steps you will have), and what size your quadrat will be (the size
              of the area you will search for plants).
            </p>
            <p>
              If you are doing a pre-existing survey type, choose the habitat
              type that best reflects the area you will be surveying - this
              contains information on habitat quality for your transect results
              to be compared to.
            </p>
            <p>
              If you have sown a seed mix in the area, you can include that here
              too.
            </p>
            <p>
              Taking into account the number of steps you need to do (the number
              of times you will stop and identify plants), plan a route that
              covers all of the different features in your habitat.
            </p>
            <img src={transectWShape} />
            <p>
              Pick up your quadrat (or something that you can use to measure out
              the area you will search for plants in) and click next to carry
              out your transect!
            </p>
          </div>
        </InfoButton>
      </InfoMessage>

      <IonList lines="full">
        <div className="rounded-list">
          <MenuAttrItem
            routerLink={`${match.url}/map`}
            value={prettyGridRef}
            icon={locationOutline}
            label="Location"
            skipValueTranslation
            disabled={isDisabled}
          />
        </div>

        <h3 className="list-title">Survey</h3>
        <div className="rounded-list">
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
          {isDisabled ||
            (!isCustom && !!steps && (
              <InfoMessage inline>
                This is the number of times that you will stop and search for
                plants on your transect.
              </InfoMessage>
            ))}

          <MenuAttrItem
            routerLink={`${match.url}/quadratSize`}
            value={!!quadratSize && `${quadratSize}m`}
            icon={squareIcon}
            label="Quadrat size"
            skipValueTranslation
            disabled={isDisabled || !isCustom || completedDetails}
          />
          {isDisabled ||
            (!isCustom && !!quadratSize && (
              <InfoMessage inline>
                This is the size of the area that you will search for plants in
                each step.
              </InfoMessage>
            ))}
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

        <h3 className="list-title">
          Seed mix (<i>optional</i>)
        </h3>
        <div className="rounded-list">
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
            label="Mix"
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
