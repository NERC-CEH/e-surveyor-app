import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { InfoBackgroundMessage } from '@flumens';
import appModel from 'models/app';

interface Props {
  name?: string;
  children: any;
}

const Message: FC<Props> = ({ name, children, ...props }) => {
  if (name && !appModel.attrs[name]) {
    return null;
  }

  const hideMessage = () => {
    appModel.attrs[name as any] = false; // eslint-disable-line
    appModel.save();
    return {};
  };

  const onHide = name ? hideMessage : undefined;
  return (
    <InfoBackgroundMessage onHide={onHide} {...props}>
      {children}
    </InfoBackgroundMessage>
  );
};

export default observer(Message);
