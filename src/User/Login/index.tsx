import React, { FC, useContext } from 'react';
import userModelProps from 'models/user';
import { NavContext } from '@ionic/react';
import Log from 'helpers/log';
import { toast, loader, Page, Header, device } from '@flumens';
import { detailsParams } from 'common/types';
import i18n from 'i18next';
import Main from './Main';
import './styles.scss';

const { success, warn, error } = toast;

type Props = {
  userModel: typeof userModelProps;
};

async function onLogin(
  userModel: typeof userModelProps,
  details: detailsParams,
  onSuccess: () => void
) {
  const { email, password } = details;

  if (!device.isOnline()) {
    warn(i18n.t("Sorry, looks like you're offline."));
    return;
  }

  await loader.show({
    message: i18n.t('Please wait...'),
  });

  try {
    await userModel.logIn(email.trim(), password);

    onSuccess();
  } catch (err) {
    if (err instanceof Error) {
      error(err.message);
    }
    Log(err, 'e');
  }

  loader.hide();
}

const LoginController: FC<Props> = ({ userModel }) => {
  const context = useContext(NavContext);
  const onSuccessReturn = () => {
    const { email } = userModel.attrs;
    success(`Successfully logged in as: ${email}`);
    context.navigate('/home/surveys', 'root');
  };

  const onLoginWrap = (details: detailsParams) =>
    onLogin(userModel, details, onSuccessReturn);

  return (
    <Page id="user-login">
      <Header className="ion-no-border" routerDirection="none" />
      <Main schema={userModel.loginSchema} onSubmit={onLoginWrap} />
    </Page>
  );
};

export default LoginController;
