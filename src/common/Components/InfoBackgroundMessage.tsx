import { observer } from 'mobx-react';
import { InfoBackgroundMessage, InfoMessageProps, PickByType } from '@flumens';
import appModel, { Data } from 'models/app';

type Props = InfoMessageProps & {
  name?: keyof PickByType<Data, boolean>;
};

const InfoBackgroundMessageWrap = ({ name, children, ...props }: Props) => {
  if (name && !appModel.data[name]) return null;

  const onHide = name
    ? () => Object.assign(appModel.data, { [name]: false })
    : undefined;

  return (
    <InfoBackgroundMessage {...props} onHide={onHide}>
      {children}
    </InfoBackgroundMessage>
  );
};

export default observer(InfoBackgroundMessageWrap);
