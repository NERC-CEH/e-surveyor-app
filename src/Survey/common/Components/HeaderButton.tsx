import { observer } from 'mobx-react';
import clsx from 'clsx';
import { Button } from '@flumens';

type Props = {
  children: any;
  onClick: any;
  isInvalid?: boolean;
  className?: string;
  color?: 'primary' | 'secondary';
};

const HeaderButton = ({
  children,
  onClick,
  isInvalid,
  className,
  color,
}: Props) => (
  <Button
    onPress={onClick}
    color={color || 'primary'}
    className={clsx(
      'max-w-28 whitespace-nowrap px-4 py-1 text-base bg-primary-600',
      isInvalid && 'opacity-50',
      className
    )}
  >
    {children}
  </Button>
);

export default observer(HeaderButton);
