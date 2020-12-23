import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Log from 'helpers/log';
import { NavContext } from '@ionic/react';
import { Trans as T } from 'react-i18next';
import { Page, device, toast, alert, loader } from '@apps';
import i18n from 'i18next';
import Main from './Main';
import './styles.scss';

const { warn, error } = toast;

async function onRegister(userModel, details, onSuccess) {
  const email = details.email.trim();
  const { password, fullName } = details;
  const otherDetails = {
    field_full_name: [{ value: fullName.trim() }],
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
      header: 'Welcome aboard 🎉',
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
    Log(err, 'e');
    error(i18n.t(err.message));
  }

  loader.hide();
}

export default function RegisterContainer({ userModel }) {
  const context = useContext(NavContext);

  const onSuccess = () => {
    context.navigate('/home/surveys', 'root');
  };

  const onRegisterWrap = details => onRegister(userModel, details, onSuccess);
  
  return (
    <Page id="user-register">
      <Main
        schema={userModel.registerSchema}
        onSubmit={onRegisterWrap}
      />
    </Page>
  );
}

RegisterContainer.propTypes = {
  userModel: PropTypes.object.isRequired,
};
