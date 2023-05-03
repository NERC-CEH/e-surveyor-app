import CONFIG from 'common/config';
import {
  DrupalUserModel,
  DrupalUserModelAttrs,
  useToast,
  useLoader,
  device,
} from '@flumens';
import * as Yup from 'yup';
import { genericStore } from './store';

export interface Attrs extends DrupalUserModelAttrs {
  fullName?: string;
}

const defaults: Attrs = {
  fullName: '',
};

class UserModel extends DrupalUserModel {
  attrs: Attrs = DrupalUserModel.extendAttrs(this.attrs, defaults);

  resetSchema: any = this.resetSchema;

  loginSchema: any = this.loginSchema;

  registerSchema: any = Yup.object().shape({
    email: Yup.string().email().required(),
    password: Yup.string().required(),
    fullName: Yup.string().required(),
  });

  constructor(options: any) {
    super(options);

    const checkForValidation = () => {
      if (this.isLoggedIn() && !this.attrs.verified) {
        console.log('User: refreshing profile for validation');
        this.refreshProfile();
      }
    };
    this.ready?.then(checkForValidation);
  }

  async checkActivation() {
    if (!this.isLoggedIn()) return false;

    if (!this.attrs.verified) {
      try {
        await this.refreshProfile();
      } catch (e) {
        // do nothing
      }

      if (!this.attrs.verified) return false;
    }

    return true;
  }

  async resendVerificationEmail() {
    if (!this.isLoggedIn() || this.attrs.verified) return false;

    await this._sendVerificationEmail();

    return true;
  }

  resetDefaults() {
    return super.resetDefaults(defaults);
  }
}

const userModel = new UserModel({
  cid: 'user',
  store: genericStore,
  config: CONFIG.backend,
});

export const useUserStatusCheck = () => {
  const toast = useToast();
  const loader = useLoader();

  return async () => {
    if (!device.isOnline) {
      toast.warn('Looks like you are offline!');
      return false;
    }

    if (!userModel.isLoggedIn()) {
      toast.warn('Please log in first.');
      return false;
    }

    if (!userModel.attrs.verified) {
      await loader.show('Please wait...');
      const isVerified = await userModel.checkActivation();
      loader.hide();

      if (!isVerified) {
        toast.warn('The user has not been activated or is blocked.');
        return false;
      }
    }

    return true;
  };
};

export default userModel;
