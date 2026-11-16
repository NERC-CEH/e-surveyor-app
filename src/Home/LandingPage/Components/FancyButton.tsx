import { useContext, type ButtonHTMLAttributes } from 'react';
import { Trans as T } from 'react-i18next';
import { NavContext } from '@ionic/react';

type Props = {
  label: string;
  path?: string;
  onClick?: () => void;
  description?: string;
  icon: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>;

const FancyButton = ({
  label,
  description,
  icon,
  path,
  onClick,
  ...otherProps
}: Props) => {
  const { navigate } = useContext(NavContext);

  const onClickWrap = () => {
    if (path) {
      navigate(path);
      return;
    }
    onClick?.();
  };

  return (
    <button
      type="button"
      className="flex items-center gap-3 w-full p-3 text-left rounded-2xl border border-white/10 bg-white/15 text-white transition-colors hover:bg-white/10 active:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-300"
      onClick={onClickWrap}
      {...otherProps}
    >
      <div className="size-14 rounded-xl shrink-0 overflow-hidden bg-[#f4f3e9]">
        <img
          src={icon}
          alt=""
          className="size-full object-cover object-center"
        />
      </div>

      <div className="flex flex-1 min-w-0 flex-col gap-1">
        <span className="text-base font-semibold leading-tight">
          <T>{label}</T>
        </span>
        {description && (
          <span className="text-sm font-normal leading-snug text-neutral-300">
            <T>{description}</T>
          </span>
        )}
      </div>

      <svg
        className="size-4 shrink-0 text-white/40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <path d="m9 5 7 7-7 7" />
      </svg>
    </button>
  );
};

export default FancyButton;
