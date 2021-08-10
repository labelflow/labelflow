declare global {
  interface Window {
    gtag: (name: string, action: string, params: any) => void;
  }
}

export const trackEvent = ({
  action,
  params,
}: {
  action: string;
  params: any;
}) => {
  window.gtag?.("event", action, params);
};
