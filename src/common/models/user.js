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
}

const defaults = {
  fullName: '',
};

Log('UserModel: initializing');
const userModel = new UserModel(genericStore, 'user', defaults, CONFIG.backend);

export default userModel;
