import React, { FC, useContext } from 'react';
import userModelProps from 'models/user';
import { NavContext } from '@ionic/react';
import { useToast, useLoader, Page, Header, device } from '@flumens';
import { detailsParams } from 'common/types';
import Main from './Main';
import './styles.scss';

type Props = {
  userModel: typeof userModelProps;
};

const LoginController: FC<Props> = ({ userModel }) => {
  const context = useContext(NavContext);
  const toast = useToast();
  const loader = useLoader();

  const onSuccessReturn = () => {
    const { email } = userModel.attrs;
    toast.success(`Successfully logged in as: ${email}`);
    context.navigate('/home/surveys', 'root');
  };

  async function onLogin(details: detailsParams) {
    const { email, password } = details;

    if (!device.isOnline) {
      toast.warn("Sorry, looks like you're offline.");
      return;
    }

    await loader.show('Please wait...');

    try {
      await userModel.logIn(email.trim(), password);

      onSuccessReturn();
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
      console.error(err);
    }

    loader.hide();
  }

  return (
    <Page id="user-login">
      <Header className="ion-no-border" routerDirection="none" title="Login" />
      <Main schema={userModel.loginSchema} onSubmit={onLogin} />
    </Page>
  );
};

export default LoginController;
