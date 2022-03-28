import React, { FC, useState } from 'react';
import { IonIcon, IonButton, IonList, IonRouterLink } from '@ionic/react';
import {
  keyOutline,
  personOutline,
  eyeOutline,
  eyeOffOutline,
} from 'ionicons/icons';
import { Trans as T } from 'react-i18next';
import { AnySchema } from 'yup';
import { Formik, Form } from 'formik';
import { Main, InputWithValidation } from '@flumens';

type Props = {
  schema: AnySchema;
  onSubmit: any;
};

const LoginMain: FC<Props> = ({ schema, onSubmit }) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePassword = () => setShowPassword(!showPassword);

  const loginForm = (props: any) => (
    <Form>
      <IonList lines="full">
        <InputWithValidation
          name="email"
          placeholder="Email"
          icon={personOutline}
          type="email"
          autocomplete="off"
          {...props}
        />
        <InputWithValidation
          name="password"
          placeholder="Password"
          icon={keyOutline}
          type={showPassword ? 'text' : 'password'}
          autocomplete="off"
          {...props}
        >
          <IonButton slot="end" onClick={togglePassword} fill="clear">
            <IonIcon
              icon={showPassword ? eyeOutline : eyeOffOutline}
              size="small"
            />
          </IonButton>
        </InputWithValidation>
        <IonRouterLink
          routerLink="/user/reset"
          className="password-forgot-button"
        >
          <T>Forgot password?</T>
        </IonRouterLink>
      </IonList>

      {/** https://github.com/formium/formik/issues/1418 */}
      <input type="submit" style={{ display: 'none' }} />
      <IonButton color="secondary" type="submit" expand="block">
        <T>Sign In</T>
      </IonButton>
    </Form>
  );

  return (
    <Main>
      <h1>
        <T>Welcome back</T>
      </h1>
      <h2>
        <T>Sign in to your account to start</T>
      </h2>

      <Formik validationSchema={schema} onSubmit={onSubmit} initialValues={{}}>
        {loginForm}
      </Formik>
    </Main>
  );
};

export default LoginMain;
