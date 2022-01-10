import React, { FC, useContext } from 'react';
import userModelProps from 'models/user';
import { NavContext } from '@ionic/react';
import { Trans as T } from 'react-i18next';
import { Page, device, toast, alert, loader } from '@flumens';
import { detailsParams } from 'common/types';
import i18n from 'i18next';
import Main from './Main';
import './styles.scss';

const { warn, error } = toast;

async function onRegister(
  userModel: typeof userModelProps,
  details: detailsParams,
  onSuccess: any
) {
  const email = details.email.trim();
  const { password, fullName } = details;
  const otherDetails = {
    field_full_name: [{ value: fullName?.trim() }],
  };

  if (!device.isOnline()) {
    warn(i18n.t("Sorry, looks like you're offline."));
    return;
  }
  await loader.show({
    message: i18n.t('Please wait...'),
  });

  try {
    await userModel.register(email, password, otherDetails);

    userModel.attrs.fullName = fullName; // eslint-disable-line
    userModel.save();

    alert({
      header: 'Welcome aboard',
      message: (
        <>
          <T>
            Before starting any surveys please check your email and click on the
            verification link.
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
      error(err.message);
    }

    console.error(err, 'e');
  }

  loader.hide();
}

type Props = {
  userModel: typeof userModelProps;
};

const RegisterContainer: FC<Props> = ({ userModel }) => {
  const context = useContext(NavContext);

  const onSuccess = () => {
    context.navigate('/home/surveys', 'root');
  };

  const onRegisterWrap = (details: detailsParams) =>
    onRegister(userModel, details, onSuccess);

  return (
    <Page id="user-register">
      <Main schema={userModel.registerSchema} onSubmit={onRegisterWrap} />
    </Page>
  );
};

export default RegisterContainer;
