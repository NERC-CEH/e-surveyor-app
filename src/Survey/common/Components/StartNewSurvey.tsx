import { useEffect, useContext } from 'react';
import { useRouteMatch } from 'react-router';
import { useAlert } from '@flumens';
import { NavContext } from '@ionic/react';
import locations from 'common/models/collections/locations';
import appModel, { SurveyDraftKeys } from 'models/app';
import samples from 'models/collections/samples';
import Location from 'models/location';
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
  const model = await survey.create!({});
  await model.save();
  if (model instanceof Sample) {
    samples.push(model);
  } else {
    locations.push(model);
  }

  appModel.data[draftIdKey] = model.cid;

  return model;
}

type Props = {
  survey: Survey;
};

function StartNewSurvey({ survey }: Props): null {
  const context = useContext(NavContext);
  const match = useRouteMatch();

  const alert = useAlert();

  const baseURL = match.url;
  const draftIdKey: any = `draftId:${survey.name}`;

  const pickDraftOrCreateModelWrap = () => {
    const pickDraftOrCreateModel = async () => {
      if (!userModel.isLoggedIn()) {
        context.navigate('/user/register', 'forward', 'replace');
        return;
      }

      let model;

      const isMothSurvey = survey.name === 'moth';
      if (!isMothSurvey) {
        model = await getDraft(draftIdKey, alert);
      }

      if (!model) {
        model = await getNewSample(survey, draftIdKey);
      }

      let path = '';
      if (model instanceof Location) {
        path = '/location';
      }

      context.navigate(`${baseURL}/${model.cid}${path}`, 'forward', 'replace');
    };

    pickDraftOrCreateModel();
  };
  useEffect(pickDraftOrCreateModelWrap, []);

  return null;
}

StartNewSurvey.with = (survey: Survey) => {
  const StartNewSurveyWithRouter = (params: any) => (
    <StartNewSurvey survey={survey} {...params} />
  );
  return StartNewSurveyWithRouter;
};

export default StartNewSurvey;
