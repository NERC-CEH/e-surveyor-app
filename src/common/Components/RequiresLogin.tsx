import type { ReactNode } from 'react';
import { observer } from 'mobx-react';
import { Redirect } from 'react-router-dom';
import type { UserModel } from 'models/user';

type Props = {
  userModel: UserModel;
  children: ReactNode;
};

const RequiresLogin = ({ userModel, children }: Props) => {
  if (!userModel.data.id) {
    return <Redirect to="/user/register" />;
  }
  return children;
};

export default observer(RequiresLogin);
