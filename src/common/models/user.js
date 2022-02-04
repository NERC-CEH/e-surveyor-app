/** ****************************************************************************
 * User model describing the user model on backend. Persistent.
 **************************************************************************** */
import Log from 'helpers/log';
import CONFIG from 'common/config';
import { DrupalUserModel, toast, loader } from '@flumens';
import * as Yup from 'yup';
import i18n from 'i18next';
import { genericStore } from './store';

const { warn, error, success } = toast;

export class UserModel extends DrupalUserModel {
  registerSchema = Yup.object().shape({
    email: Yup.string().email().required(),
    password: Yup.string().required(),
    fullName: Yup.string().required(),
  });

  hasLogIn() {
    return !!this.attrs.email;
  }

  async checkActivation() {
    const isLoggedIn = !!this.attrs.id;
    if (!isLoggedIn) {
      warn(i18n.t('Please log in first.'));
      return false;
    }

    if (!this.attrs.verified) {
      await loader.show({
        message: i18n.t('Please wait...'),
      });

      try {
        await this.refreshProfile();
      } catch (e) {
        // do nothing
      }

      loader.hide();

      if (!this.attrs.verified) {
        warn(i18n.t('The user has not been activated or is blocked.'));
        return false;
      }
    }

    return true;
  }

  async resendVerificationEmail() {
    const isLoggedIn = !!this.attrs.id;
    if (!isLoggedIn) {
      warn(i18n.t('Please log in first.'));
      return false;
    }

    if (this.attrs.verified) {
      warn(i18n.t('You are already verified.'));
      return false;
    }

    await loader.show({
      message: i18n.t('Please wait...'),
    });

    try {
      await super.resendVerificationEmail();
      success(
        i18n.t(
          'A new verification email was successfully sent now. If you did not receive the email, then check your Spam or Junk email folders.'
        ),
        5000
      );
    } catch (e) {
      error(e);
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
