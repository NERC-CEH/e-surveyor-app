import { FC } from 'react';
import { Formik, Form } from 'formik';
import { personOutline } from 'ionicons/icons';
import { Trans as T } from 'react-i18next';
import { Main, InputWithValidation } from '@flumens';
import { IonButton, IonList } from '@ionic/react';

type Props = {
  onSubmit: any;
  schema: any;
};

const ResetMain: FC<Props> = ({ onSubmit, schema }) => {
  const resetForm = (props: any) => (
    <Form>
      <IonList lines="full">
        <div className="rounded">
          <InputWithValidation
            name="email"
            placeholder="Email"
            icon={personOutline}
            type="email"
            autocomplete="off"
            {...props}
          />
        </div>
      </IonList>

      <IonButton color="secondary" type="submit" expand="block">
        <T>Reset</T>
      </IonButton>
    </Form>
  );

  return (
    <Main>
      <h2>
        <T>Enter your email address to request a password reset.</T>
      </h2>

      <Formik
        validationSchema={schema}
        onSubmit={onSubmit}
        initialValues={{ email: '' }}
      >
        {resetForm}
      </Formik>
    </Main>
  );
};

export default ResetMain;
