import React, { useEffect, useContext } from 'react';
import { NavContext } from '@ionic/react';
import appModel from 'appModel';
import Sample from 'sample';
import savedSamples from 'savedSamples';
import { withRouter } from 'react-router';

async function getNewSample(survey, draftIdKey) {
  const sample = await survey.create(Sample);
  await sample.save();

  savedSamples.push(sample);

  appModel.attrs[draftIdKey] = sample.cid;
  await appModel.save();

  return sample;
}

function StartNewSurvey({ match, survey }) {
  const context = useContext(NavContext);

  const draftIdKey = `draftId:${survey.name}`;

  const createSample = async () => {
    const sample = await getNewSample(survey, draftIdKey);

    const url = match.url.replace('/new', '');

    context.navigate(`${url}/${sample.cid}`, 'none', 'replace');
  };

  const pickDraftOrCreateSampleWrap = () => createSample(); // effects don't like async
  useEffect(pickDraftOrCreateSampleWrap, []);

  return null;
}

// eslint-disable-next-line @getify/proper-arrows/name
StartNewSurvey.with = survey => {
  const StartNewSurveyWrap = params => (
    <StartNewSurvey survey={survey} {...params} />
  );

  return withRouter(StartNewSurveyWrap);
};

export default withRouter(StartNewSurvey);
