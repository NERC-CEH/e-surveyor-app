declare const appModel: {
  _init: any;
  attrs: any;
  save: () => void;
  getPrettyName: () => void;
  hasLogIn: () => boolean;
  refreshProfile: () => void;
  resetDefaults: () => void;
  resetSchema: () => void;
  reset: (email: string) => void;
  loginSchema: () => void;
  checkActivation: (toast: any, loader: any) => Promise<boolean>;
  resendVerificationEmail: (toast: any, loader: any) => Promise<boolean>;
  logIn: (email: string, password: string) => void;

  registerSchema: () => void;
  register: (email: string, password: string, otherDetails: any) => void;
};

export default appModel;
