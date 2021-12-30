declare const appModel: {
  _init: any;
  attrs: any;
  save: () => void;
  getPrettyName: () => void;
  hasLogIn: () => void;
  refreshProfile: () => void;
  resetDefaults: () => void;
  resetSchema: () => void;
  reset: (email: string) => void;
};

export default appModel;
