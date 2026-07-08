import { Route } from 'react-router-dom';
import Location from '@flumens/models/dist/Indicia/Location';
import Sample from '@flumens/models/dist/Indicia/Sample';
import Model from '@flumens/models/dist/Model';

const byId =
  (id: any) =>
  ({ cid }: any) =>
    cid === id;

export function getModels(allModels: Model[], match: any) {
  const { smpId, subSmpId, subSubSmpId, occId, locId } = match.params;
  const models: any = {};

  if (locId) {
    const location = allModels.find(byId(locId)) as Location;
    models.location = location;
  }

  let sample: Sample | undefined;
  if (smpId) {
    sample = allModels.find(byId(smpId)) as Sample;
    models.sample = sample;
  }

  let subSample: Sample | undefined;
  if (subSmpId && sample) {
    subSample = sample.samples.find(byId(subSmpId));
    models.subSample = subSample;
  }

  let subSubSample: Sample | undefined;
  if (subSubSmpId && subSample && sample) {
    subSubSample = subSample.samples.find(byId(subSubSmpId));
    models.subSubSample = subSubSample;
  }

  const closestSample = subSubSample || subSample || sample;
  if (occId && closestSample) {
    const occurrence = closestSample.occurrences.find(byId(occId));
    models.occurrence = occurrence;
  }

  return models;
}

type Props = {
  component: any; // must be valid React component - validation done at Route lvl
  models: Model[];
  path: string; // sometimes route is nested and match is passed through
  exact?: boolean;
  strict?: boolean;
};
const RouteWithModels = ({
  component: Component,
  models: modelsProp,
  strict = true,
  ...props
}: Props) => {
  function render({ match }: any) {
    const models = getModels(modelsProp, match);

    const { smpId, subSmpId, subSubSmpId, occId, locId } = match.params;

    const sampleIsMissing = smpId && !models.sample;

    const subSampleIsRequiredButMissing = subSmpId && !models.subSample;
    const locationIsRequiredButMissing = locId && !models.location;

    const subSubSampleIsRequiredButMissing =
      subSubSmpId && !models.subSubSample;

    const occurrenceIsRequiredButMissing = occId && !models.occurrence;

    if (
      strict &&
      (sampleIsMissing ||
        locationIsRequiredButMissing ||
        subSampleIsRequiredButMissing ||
        subSubSampleIsRequiredButMissing ||
        occurrenceIsRequiredButMissing)
    ) {
      return null;
    }

    return <Component {...models} />;
  }

  return <Route render={render} {...props} />;
};

/**
 * Helper function.
 */
RouteWithModels.fromArray = (
  models: Model[],
  routes: any,
  strict?: boolean
) => {
  const getRouteWithModels = ([path, component, skipModels]: any) => {
    if (skipModels) {
      return <Route key={path} path={path} component={component} exact />;
    }

    return (
      <RouteWithModels
        key={path}
        path={path}
        component={component}
        models={models}
        strict={strict}
        exact
      />
    );
  };

  return routes.map(getRouteWithModels);
};

export default RouteWithModels;
