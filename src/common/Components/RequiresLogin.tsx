import { FC } from 'react';
import { observer } from 'mobx-react';
import { Redirect } from 'react-router-dom';

type Props = {
  userModel: any;
  children: any;
};

const RequiresLogin: FC<Props> = ({ userModel, children }) => {
  if (!userModel.attrs.id) {
    return <Redirect to="/user/register" />;
  }
  return children;
};

export default observer(RequiresLogin);
