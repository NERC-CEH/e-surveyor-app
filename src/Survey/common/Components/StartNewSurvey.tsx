import React, { useEffect, useContext } from 'react';
import { NavContext } from '@ionic/react';
import { useAlert } from '@flumens';
import appModel, { SurveyDraftKeys } from 'models/app';
import userModel from 'models/user';
import Sample from 'models/sample';
import savedSamples from 'models/savedSamples';
import { Survey } from 'common/surveys';

async function showDraftAlert(alert: any) {
  const showDraftDialog = (resolve: any) => {
    alert({
      header: 'Draft',
      message: 'Previous survey draft exists, would you like to continue it?',
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
  return new Promise(showDraftDialog);
}

async function getDraft(draftIdKey: keyof SurveyDraftKeys, alert: any) {
  const draftID = appModel.attrs[draftIdKey];
  if (draftID) {
    const draftById = ({ cid }: Sample) => cid === draftID;
    const draftSample = savedSamples.find(draftById);
    if (draftSample && !draftSample.isDisabled()) {
      const continueDraftRecord = await showDraftAlert(alert);
      if (continueDraftRecord) {
        return draftSample;
      }

      draftSample.destroy();
    }
  }

  return null;
}

async function getNewSample(survey: Survey, draftIdKey: keyof SurveyDraftKeys) {
  const sample = await survey.create(Sample);
  await sample.save();

  savedSamples.push(sample);

  appModel.attrs[draftIdKey] = sample.cid;

  return sample;
}

type Props = {
  survey: Survey;
};

function StartNewSurvey({ survey }: Props): null {
  const context = useContext(NavContext);
  const alert = useAlert();

  const baseURL = `/survey/${survey.name}`;
  const draftIdKey: keyof SurveyDraftKeys = `draftId:${survey.name}`;

  const pickDraftOrCreateSampleWrap = () => {
    const pickDraftOrCreateSample = async () => {
      if (!userModel.isLoggedIn()) {
        context.navigate(`/user/register`, 'none', 'replace');
        return;
      }

      let sample = await getDraft(draftIdKey, alert);

      if (!sample) {
        sample = await getNewSample(survey, draftIdKey);
      }

      const path = sample.isDetailsComplete() ? '' : '/details';

      context.navigate(`${baseURL}/${sample.cid}${path}`, 'none', 'replace');
    };

    pickDraftOrCreateSample();
  };
  useEffect(pickDraftOrCreateSampleWrap, []);

  return null;
}

// eslint-disable-next-line @getify/proper-arrows/name
StartNewSurvey.with = (survey: Survey) => {
  const StartNewSurveyWithRouter = (params: any) => (
    <StartNewSurvey survey={survey} {...params} />
  );
  return StartNewSurveyWithRouter;
};

export default StartNewSurvey;
