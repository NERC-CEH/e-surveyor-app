declare const surveyDraftKeys: {
  'draftId:point'?: string;
  'draftId:transect'?: string;
};

declare const appModel: {
  _init: any;

  attrs: {
    appSession: number;
    showedWelcome: boolean;
    showFirstSurveyTip: boolean;
    use10stepsForCommonStandard: boolean;
    sendAnalytics: boolean;
  } & surveyDraftKeys;

  save: () => void;
  resetDefaults: () => void;
};

export default appModel;
