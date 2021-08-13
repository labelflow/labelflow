// See https://mariestarck.com/add-google-analytics-to-your-next-js-application-in-5-easy-steps/

declare global {
  interface Window {
    gtag: (name: string, action: string, params: any) => void;
  }
}

export const pageView = (url: string) => {
  window.gtag?.("config", process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS as string, {
    page_path: url,
  });
};

export const trackEvent = (action: string, params: any) => {
  window.gtag?.("event", action, params);
};
