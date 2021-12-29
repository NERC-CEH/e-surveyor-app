declare const appModel: {
  attrs: {
    appSession: number;
    showedWelcome: boolean;
    showFirstSurveyTip: boolean;
    use10stepsForCommonStandard: boolean;
    sendAnalytics: boolean;
  };

  save: () => void;
};

export default appModel;
