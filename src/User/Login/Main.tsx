import { useState } from 'react';
import clsx from 'clsx';
import {
  keyOutline,
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
import { UserModel } from 'models/user';
import ControlledInput from '../common/Components/ControlledInput';

type Details = TypeOf<typeof UserModel.loginSchema>;

type Props = {
  onSubmit: SubmitHandler<Details>;
};

const LoginMain = ({ onSubmit }: Props) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePassword = () => setShowPassword(!showPassword);

  const { formState, handleSubmit, control } = useForm<Details>({
    defaultValues: { email: '', password: '' },
    resolver: zodResolver(UserModel.loginSchema),
  });

  return (
    <Main>
      <div className="mx-auto flex max-w-md flex-col gap-8 px-3 pt-3">
        <h1 className="text-center">
          <T>Welcome back</T>
        </h1>
        <h2 className="-mt-5 text-center">
          <T>Sign in to your account to start</T>
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded">
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
          <div className="flex justify-end">
            <IonRouterLink
              routerLink="/user/reset"
              className="text-sm text-primary-950"
            >
              <T>Forgot password?</T>
            </IonRouterLink>
          </div>

          <Button
            className={clsx('mx-auto mt-7', !formState.isValid && 'opacity-50')}
            color="primary"
            type="submit"
          >
            Sign in
          </Button>
        </form>
      </div>
    </Main>
  );
};

export default LoginMain;
