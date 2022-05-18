import { FC, useContext } from 'react';
import userModelProps from 'models/user';
import { NavContext } from '@ionic/react';
import { Trans as T } from 'react-i18next';
import { Page, Header, device, useToast, useAlert, useLoader } from '@flumens';
import Main from './Main';
import './styles.scss';

export type Details = {
  password: string;
  email: string;
  fullName?: string | undefined;
};

type Props = {
  userModel: typeof userModelProps;
};

const RegisterContainer: FC<Props> = ({ userModel }) => {
  const context = useContext(NavContext);
  const alert = useAlert();
  const toast = useToast();
  const loader = useLoader();

  const onSuccess = () => {
    context.navigate('/home/landing', 'root');
  };

  async function onRegister(details: Details) {
    const email = details.email.trim();
    const { password, fullName } = details;
    const otherDetails = {
      field_full_name: [{ value: fullName?.trim() }],
    };

    if (!device.isOnline) {
      toast.warn("Sorry, looks like you're offline.");
      return;
    }
    await loader.show('Please wait...');

    try {
      await userModel.register(email, password, otherDetails);

      userModel.attrs.fullName = fullName; // eslint-disable-line

      alert({
        header: 'Welcome aboard',
        message: (
          <>
            <T>
              Before starting any surveys please check your email and click on
              the verification link.
            </T>
          </>
        ),
        buttons: [
          {
            text: 'OK, got it',
            role: 'cancel',
            handler: onSuccess,
          },
        ],
      });
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
      console.error(err, 'e');
    }

    loader.hide();
  }

  return (
    <Page id="user-register">
      <Header className="ion-no-border" title="Register" />
      <Main schema={userModel.registerSchema} onSubmit={onRegister} />
    </Page>
  );
};

export default RegisterContainer;
