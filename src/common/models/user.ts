import CONFIG from 'common/config';
import { DrupalUserModel, DrupalUserModelAttrs } from '@flumens';
import * as Yup from 'yup';
import { set } from 'mobx';
import { genericStore } from './store';

export interface Attrs extends DrupalUserModelAttrs {
  fullName?: string;
}

const defaults: Attrs = {
  fullName: '',
};

class UserModel extends DrupalUserModel {
  attrs: Attrs = DrupalUserModel.extendAttrs(this.attrs, defaults);

  registerSchema = Yup.object().shape({
    email: Yup.string().email().required(),
    password: Yup.string().required(),
    fullName: Yup.string().required(),
  });

  async checkActivation(toast: any, loader: any) {
    const isLoggedIn = !!this.id;
    if (!isLoggedIn) {
      toast.warn('Please log in first.');
      return false;
    }

    if (!this.attrs.verified) {
      await loader.show('Please wait...');

      try {
        await this.refreshProfile();
      } catch (e) {
        // do nothing
      }

      loader.hide();

      if (!this.attrs.verified) {
        toast.warn('The user has not been activated or is blocked.');
        return false;
      }
    }

    return true;
  }

  async resendVerificationEmail(toast: any, loader: any) {
    const isLoggedIn = !!this.id;
    if (!isLoggedIn) {
      toast.warn('Please log in first.');
      return false;
    }

    if (this.attrs.verified) {
      toast.warn('You are already verified.');
      return false;
    }

    await loader.show('Please wait...');

    try {
      await this._sendVerificationEmail();
      toast.success(
        'A new verification email was successfully sent now. If you did not receive the email, then check your Spam or Junk email folders.',
        5000
      );
    } catch (e) {
      toast.error(e);
    }

    loader.hide();

    return true;
  }

  resetDefaults() {
    super.resetDefaults();
    set(this.attrs, JSON.parse(JSON.stringify(defaults)));
    return this.save();
  }
}

const userModel = new UserModel({
  cid: 'user',
  store: genericStore,
  config: CONFIG.backend,
});

export default userModel;
