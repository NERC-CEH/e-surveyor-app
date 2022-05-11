import { observer } from 'mobx-react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

const RequiresLogin = ({ userModel, children }) => {
  if (!userModel.attrs.id) {
    return <Redirect to="/user/register" />;
  }
  return children;
};

RequiresLogin.propTypes = {
  userModel: PropTypes.object.isRequired,
  children: PropTypes.any.isRequired,
};

export default observer(RequiresLogin);
