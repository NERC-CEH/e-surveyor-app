/** ****************************************************************************
 * User model describing the user model on backend. Persistent.
 **************************************************************************** */
import Log from 'helpers/log';
import CONFIG from 'common/config';
import { DrupalUserModel } from '@flumens';
import * as Yup from 'yup';
import { genericStore } from './store';

export class UserModel extends DrupalUserModel {
  registerSchema = Yup.object().shape({
    email: Yup.string().email().required(),
    password: Yup.string().required(),
    fullName: Yup.string().required(),
  });

  hasLogIn() {
    return !!this.attrs.email;
  }

  async checkActivation(toast, loader) {
    const isLoggedIn = !!this.attrs.id;
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

  async resendVerificationEmail(toast, loader) {
    const isLoggedIn = !!this.attrs.id;
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
      await super.resendVerificationEmail();
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
}

const defaults = {
  fullName: '',
};

Log('UserModel: initializing');
const userModel = new UserModel(genericStore, 'user', defaults, CONFIG.backend);

export default userModel;
