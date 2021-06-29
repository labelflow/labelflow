declare let self: ServiceWorkerGlobalScope;

// eslint-disable-next-line import/no-mutable-exports
export let isInWindowScope: boolean | null = null;

// eslint-disable-next-line import/no-mutable-exports
export let isInServiceWorkerScope: boolean | null = null;

// eslint-disable-next-line import/no-mutable-exports
export let browserName: "chrome" | "safari" | "other" | null = null;

// Robust way to detect if window exists, only once
const detectScope = () => {
  if (isInWindowScope === null) {
    try {
      if (window) {
        isInWindowScope = true;

        // Detect browser
        // See https://stackoverflow.com/a/7944490/2371254
        const ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf("safari") != -1) {
          if (ua.indexOf("chrome") > -1) {
            browserName = "chrome";
          } else {
            browserName = "safari";
          }
        } else {
          browserName = "other";
        }
      } else {
        isInWindowScope = false;
      }
    } catch (e) {
      isInWindowScope = false;
    }
  }

  if (isInServiceWorkerScope === null) {
    try {
      if (self) {
        isInServiceWorkerScope = true;
      } else {
        isInServiceWorkerScope = false;
      }
    } catch (e) {
      isInServiceWorkerScope = false;
    }
  }
};
detectScope();
