import React, { useEffect, useContext } from 'react';
import { NavContext } from '@ionic/react';
import { alert } from '@apps';
import appModel from 'appModel';
import Sample from 'sample';
import savedSamples from 'savedSamples';
import { withRouter } from 'react-router';

async function showDraftAlert() {
  const showAlert = resolve => {
    alert({
      header: 'Draft',
      message: 'Previous survey draft exists, would you like to continue it?',
      skipTranslation: true,
      backdropDismiss: false,
      buttons: [
        {
          text: 'Discard',
          handler: () => {
            resolve(false);
          },
        },
        {
          text: 'Continue',
          cssClass: 'primary',
          handler: () => {
            resolve(true);
          },
        },
      ],
    });
  };

  return new Promise(showAlert);
}

async function getDraft(draftIdKey) {
  const draftID = appModel.attrs[draftIdKey];

  const getDraftID = ({ cid }) => cid === draftID;

  if (draftID) {
    const draftSample = savedSamples.find(getDraftID);
    if (draftSample) {
      const continueDraftRecord = await showDraftAlert();
      if (continueDraftRecord) {
        return draftSample;
      }

      draftSample.destroy();
    }
  }

  return null;
}

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

  const pickDraftOrCreateSample = async () => {
    let sample = await getDraft(draftIdKey);
    if (!sample) {
      sample = await getNewSample(survey, draftIdKey);
    }

    const url = match.url.replace('/new', '');

    context.navigate(`${url}/${sample.cid}/edit`, 'none', 'replace');
  };

  const pickDraftOrCreateSampleWrap = () => pickDraftOrCreateSample(); // effects don't like async
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
