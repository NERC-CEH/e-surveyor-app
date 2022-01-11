import React, { useEffect, useContext } from 'react';
import { NavContext } from '@ionic/react';
import Sample from 'models/sample';
import savedSamples from 'models/savedSamples';
import { useRouteMatch } from 'react-router';
import { Survey } from 'common/surveys';

async function getNewSample(survey: Survey) {
  const sample = await survey.create(Sample);
  await sample.save();

  savedSamples.push(sample);

  return sample;
}
type Props = {
  survey: Survey;
};

function StartNewSurvey({ survey }: Props) {
  const { navigate } = useContext(NavContext);
  const { url } = useRouteMatch();

  const createSample = async () => {
    const sample = await getNewSample(survey);

    let path = `${url}/${sample.cid}`;
    if (survey.name === 'transect') {
      path += '/details';
    }

    navigate(path, 'none', 'replace');
  };

  const pickDraftOrCreateSampleWrap: any = () => createSample(); // effects don't like async
  useEffect(pickDraftOrCreateSampleWrap, []);

  return null;
}

// eslint-disable-next-line @getify/proper-arrows/name
StartNewSurvey.with = (survey: Survey) => {
  const StartNewSurveyWrap = (params: any) => (
    <StartNewSurvey survey={survey} {...params} />
  );

  return StartNewSurveyWrap;
};

export default StartNewSurvey;
