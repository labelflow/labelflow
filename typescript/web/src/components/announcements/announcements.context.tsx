import AnnounceKitWrapper from "announcekit-react";
import { isEmpty, isNil } from "lodash/fp";
import {
  createContext,
  useRef,
  PropsWithChildren,
  RefObject,
  useCallback,
  useContext,
} from "react";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import {
  ANNOUNCEKIT_URL,
  ANNOUNCEKIT_UNREAD_REFRESH_INTERVAL,
} from "./announcements.constants";
import { trackEvent } from "../../utils/google-analytics";
import { AnnounceKitProps } from "./announcekit-props";

export type AnnounceKitProviderProps = PropsWithChildren<
  Pick<AnnounceKitProps, "labels" | "boosters" | "widget">
>;

export type AnnouncementsState = {
  unread?: number;
  openWidget: () => void;
};

const AnnouncementsContext = createContext({} as AnnouncementsState);

export const useAnnouncements = () => useContext(AnnouncementsContext);

const queryClient = new QueryClient();

const toNumber = (value: unknown): number | undefined => {
  if (value === undefined || typeof value === "number") {
    return value;
  }
  // We don't want to crash the whole application because of AnnounceKit
  // poorly-typed component props.
  // eslint-disable-next-line no-console
  console.error("Invalid AnnounceKit value count", value);
  return undefined;
};

// Exponential retry delay
const retryDelay = (attempt: number): number =>
  Math.min(attempt > 1 ? 2 ** attempt * 1000 : 1000, 30 * 1000);

const useUnread = (
  widget: string,
  ref: RefObject<AnnounceKitWrapper>
): number | undefined => {
  const key = `unread:${widget}`;
  const { data: unread } = useQuery(key, () => ref.current?.unread(), {
    keepPreviousData: true,
    staleTime: ANNOUNCEKIT_UNREAD_REFRESH_INTERVAL,
    retry: 3,
    retryDelay,
    // eslint-disable-next-line no-console
    onError: console.error,
  });
  return toNumber(unread);
};

const useOpenWidget = (
  wrapperRef: RefObject<AnnounceKitWrapper>
): (() => void) => {
  return useCallback(() => {
    wrapperRef.current?.open();
    trackEvent("announcements_open_widget", {});
  }, [wrapperRef]);
};

const AnnounceKitProvider = ({
  widget,
  children,
  labels,
  ...props
}: AnnounceKitProviderProps) => {
  const wrapperRef = useRef<AnnounceKitWrapper>(null);
  const unread = useUnread(widget, wrapperRef);
  const openWidget = useOpenWidget(wrapperRef);
  // string[]' is not assignable to type '[string]'
  // https://github.com/announcekitapp/announcekit-react/pull/26
  const announceKitProps = {
    ...props,
    labels: labels ? ([labels[0]] as [string]) : undefined,
  };
  return (
    <AnnouncementsContext.Provider value={{ unread, openWidget }}>
      <AnnounceKitWrapper
        ref={wrapperRef}
        widget={widget}
        {...announceKitProps}
      >
        {children}
      </AnnounceKitWrapper>
    </AnnouncementsContext.Provider>
  );
};

export type AnnouncementsProviderProps = Required<PropsWithChildren<{}>> &
  Omit<AnnounceKitProviderProps, "children" | "widget"> &
  Partial<Pick<AnnounceKitProviderProps, "widget">>;

export const AnnouncementsProvider = ({
  widget = ANNOUNCEKIT_URL,
  children,
  ...props
}: AnnouncementsProviderProps) => (
  <>
    {!isNil(widget) && !isEmpty(widget) && (
      <QueryClientProvider client={queryClient}>
        <AnnounceKitProvider widget={widget} {...props}>
          {children}
        </AnnounceKitProvider>
      </QueryClientProvider>
    )}
  </>
);
