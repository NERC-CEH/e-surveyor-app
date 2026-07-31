import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  createRef,
} from 'react';
import { useLocation as useRouterLocation } from 'react-router';
import { useIonViewWillEnter } from '@ionic/react';

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

const DEFAULT_THRESHOLD = 50;

export const HeaderScrollProvider = ({
  children,
  threshold = DEFAULT_THRESHOLD,
}: Props) => {
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
  const contentRef = createRef<HTMLIonContentElement>();

  const isScrolled = useContext(HeaderScrollContext);
  const onIonScroll = useContext(HeaderScrollHandlerContext);
  if (isScrolled === undefined || !onIonScroll) {
    throw new Error('useHeaderScroll must be used within HeaderScrollProvider');
  }

  useIonViewWillEnter(() => {
    (async () => {
      const el = contentRef.current;
      if (!el) return;
      const scrollEl = await el.getScrollElement();
      onIonScroll({ detail: { scrollTop: scrollEl.scrollTop } } as any);
    })();
  }, [contentRef]);

  return {
    ref: contentRef,
    isScrolled,
    onIonScroll,
    fullscreen: true,
    scrollEvents: true,
  };
};

export default useHeaderScroll;
