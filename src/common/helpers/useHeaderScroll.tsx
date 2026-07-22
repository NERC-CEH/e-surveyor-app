import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { useLocation as useRouterLocation } from 'react-router';

type ScrollEvent = CustomEvent<{ scrollTop: number }>;

type HeaderScrollContextValue = boolean;

type ScrollHandler = (event: ScrollEvent) => void;

type Props = {
  children: ReactNode;
  threshold?: number;
};

const HeaderScrollContext = createContext<HeaderScrollContextValue | undefined>(
  undefined
);

const HeaderScrollHandlerContext = createContext<ScrollHandler | undefined>(
  undefined
);

export const HeaderScrollProvider = ({ children, threshold = 70 }: Props) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const routeLocation = useRouterLocation();

  // reset scroll when URL path changes
  useEffect(() => {
    setIsScrolled(false);
  }, [routeLocation.pathname]);

  // eslint-disable-next-line react/hook-use-state
  const [onIonScroll] = useState<ScrollHandler>(() => (event: ScrollEvent) => {
    setIsScrolled(event.detail.scrollTop > threshold);
  });

  return (
    <HeaderScrollContext.Provider value={isScrolled}>
      <HeaderScrollHandlerContext.Provider value={onIonScroll}>
        {children}
      </HeaderScrollHandlerContext.Provider>
    </HeaderScrollContext.Provider>
  );
};

const useHeaderScroll = () => {
  const isScrolled = useContext(HeaderScrollContext);
  const onIonScroll = useContext(HeaderScrollHandlerContext);

  if (isScrolled === undefined || !onIonScroll) {
    throw new Error('useHeaderScroll must be used within HeaderScrollProvider');
  }

  return { isScrolled, onIonScroll, fullscreen: true, scrollEvents: true };
};

export default useHeaderScroll;
