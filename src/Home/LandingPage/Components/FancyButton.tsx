import { useContext, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { Trans as T } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { JSX } from '@ionic/core';
import { NavContext } from '@ionic/react';

type Props = {
  label: string;
  path?: string;
  onClick?: any;
  description?: string;
  icon: string;
} & JSX.IonButton;

const FancyButton = ({
  label,
  description,
  icon,
  path,
  onClick,
  ...otherProps
}: Props) => {
  const { pathname } = useLocation<any>();

  const ref = useRef<HTMLDivElement>(null);
  const [fullyVisible, setFullyVisible] = useState(true);
  const [isAnimationActive, setIsAnimationActive] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const isOnActivePage = pathname === '/home/home';

    setTimeout(() => setIsAnimationActive(isOnActivePage), 100);
  }, [pathname]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // threshold 1.0 fires only when the element is 100% visible
    observerRef.current = new IntersectionObserver(
      ([entry]) => setFullyVisible(entry.intersectionRatio >= 1),
      { threshold: 1.0 }
    );

    observerRef.current.observe(el);

    // disconnect observer when component unmounts
    return () => observerRef.current?.disconnect(); // eslint-disable-line consistent-return
  }, []);

  const { navigate } = useContext(NavContext);

  const onClickWrap = () => {
    if (path) {
      navigate(path);
      return;
    }
    onClick?.();
  };

  return (
    <div
      className={clsx(
        'flex justify-between items-center w-full p-2 pl-5 shadow-[0_20px_50px_rgba(0,0,0,0.35),0_5px_10px_rgba(0,0,0,0.35)] overflow-hidden rounded-xl bg-white',
        isAnimationActive && 'transition-opacity duration-300',
        !fullyVisible ? 'opacity-70' : 'opacity-100'
      )}
      color="light"
      onClick={onClickWrap}
      {...otherProps}
      ref={ref}
    >
      <div className="flex flex-col">
        <div className="line-clamp-1 font-bold! text-primary-900">
          <T>{label}</T>
        </div>
        {description && (
          <span className="text-sm line-clamp-1">
            <T>{description}</T>
          </span>
        )}
      </div>

      <img
        src={icon}
        className="size-13 ml-2.5 rounded-xl shrink-0 border-primary-700/20 border"
      />
    </div>
  );
};

export default FancyButton;
