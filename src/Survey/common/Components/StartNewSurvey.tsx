import { useEffect, useContext } from 'react';
import { useAlert } from '@flumens';
import { NavContext } from '@ionic/react';
import appModel, { SurveyDraftKeys } from 'models/app';
import samples from 'models/collections/samples';
import Sample from 'models/sample';
import userModel from 'models/user';
import { Survey } from '../config';

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
  const draftID = appModel.data[draftIdKey];
  if (draftID) {
    const draftById = ({ cid }: Sample) => cid === draftID;
    const draftSample = samples.find(draftById);
    if (draftSample && !draftSample.isDisabled) {
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
  const sample = await survey.create!({ Sample });
  await sample.save();

  samples.push(sample);

  appModel.data[draftIdKey] = sample.cid;

  return sample;
}

type Props = {
  survey: Survey;
};

function StartNewSurvey({ survey }: Props): null {
  const context = useContext(NavContext);
  const alert = useAlert();

  const baseURL = `/survey/${survey.name}`;
  const draftIdKey: any = `draftId:${survey.name}`;

  const pickDraftOrCreateSampleWrap = () => {
    const pickDraftOrCreateSample = async () => {
      if (!userModel.isLoggedIn()) {
        context.navigate(`/user/register`, 'forward', 'replace');
        return;
      }

      let sample;

      const isMothSurvey = survey.name === 'moth';
      if (!isMothSurvey) {
        sample = await getDraft(draftIdKey, alert);
      }

      if (!sample) {
        sample = await getNewSample(survey, draftIdKey);
      }

      const path = sample.isDetailsComplete() ? '' : '/details';

      context.navigate(`${baseURL}/${sample.cid}${path}`, 'forward', 'replace');
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
