import { useState } from 'react';
import clsx from 'clsx';
import {
  keyOutline,
  personOutline,
  eyeOutline,
  eyeOffOutline,
  mailOutline,
} from 'ionicons/icons';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Trans as T } from 'react-i18next';
import { TypeOf } from 'zod';
import { Main, Button } from '@flumens';
import { zodResolver } from '@hookform/resolvers/zod';
import { IonIcon, IonRouterLink } from '@ionic/react';
import config from 'common/config';
import { UserModel } from 'models/user';
import ControlledInput from '../common/Components/ControlledInput';

type Details = TypeOf<typeof UserModel.registerSchema>;

type Props = {
  onSubmit: SubmitHandler<Details>;
};

const RegisterMain = ({ onSubmit }: Props) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePassword = () => setShowPassword(!showPassword);

  const { formState, handleSubmit, control } = useForm<Details>({
    defaultValues: { fullName: '', email: '', password: '' },
    resolver: zodResolver(UserModel.registerSchema),
  });

  return (
    <Main>
      <div className="mx-auto max-w-md px-3">
        <h1 className="my-10 text-center">
          <T>Create a free account</T>
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
          <div className="rounded">
            <ControlledInput
              control={control}
              name="fullName"
              startAddon={
                <IonIcon icon={personOutline} className="mx-2 opacity-60" />
              }
              autoComplete="off"
              placeholder="Full Name"
              platform="ios"
            />

            <ControlledInput
              control={control}
              name="email"
              startAddon={
                <IonIcon icon={mailOutline} className="mx-2 opacity-60" />
              }
              type="email"
              autoComplete="off"
              placeholder="Email"
              platform="ios"
            />

            <ControlledInput
              control={control}
              name="password"
              startAddon={
                <IonIcon icon={keyOutline} className="mx-2 opacity-60" />
              }
              endAddon={
                <IonIcon
                  icon={showPassword ? eyeOutline : eyeOffOutline}
                  className="opacity-60"
                  onClick={togglePassword}
                />
              }
              type={showPassword ? 'text' : 'password'}
              autoComplete="off"
              placeholder="Password"
              platform="ios"
            />
          </div>

          <div className="px-5 py-1 text-sm">
            <T>
              By clicking Sign Up, you agree to our{' '}
              <IonRouterLink href={`${config.backend.url}/privacy-notice`}>
                Privacy Policy
              </IonRouterLink>{' '}
              and{' '}
              <IonRouterLink href={`${config.backend.url}/terms-of-use`}>
                Terms and Conditions
              </IonRouterLink>
            </T>
          </div>

          <Button
            className={clsx('mx-auto mt-8', !formState.isValid && 'opacity-50')}
            color="primary"
            type="submit"
          >
            Sign Up
          </Button>
        </form>

        <div className="mt-10 text-center">
          <T>I am already a member</T>.{' '}
          <IonRouterLink routerLink="/user/login">
            <T>Sign In</T>
          </IonRouterLink>
        </div>
      </div>
    </Main>
  );
};

export default RegisterMain;
