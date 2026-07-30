import clsx from 'clsx';

type Props = {
  size?: number;
  className?: string;
};

const CircleIcon = ({ size = 24, className }: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={clsx('shrink-0', className)}
  >
    <circle cx="12" cy="12" r="12" />
  </svg>
);

export default CircleIcon;
