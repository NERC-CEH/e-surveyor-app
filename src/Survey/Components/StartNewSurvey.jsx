import React, { useEffect, useContext } from 'react';
import { NavContext } from '@ionic/react';
import Sample from 'sample';
import savedSamples from 'savedSamples';
import { withRouter } from 'react-router';

async function getNewSample(survey) {
  const sample = await survey.create(Sample);
  await sample.save();

  savedSamples.push(sample);

  return sample;
}

function StartNewSurvey({ match, survey }) {
  const context = useContext(NavContext);

  const createSample = async () => {
    const sample = await getNewSample(survey);

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
