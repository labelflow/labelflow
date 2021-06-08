// eslint-disable-next-line import/no-mutable-exports
export let windowExists: boolean | null = null;

// Robust way to detect if window exists, only once
const detectWindow = () => {
  if (windowExists === null) {
    try {
      if (window) {
        windowExists = true;
      } else {
        windowExists = false;
      }
    } catch (e) {
      windowExists = false;
    }
  }
};
detectWindow();

declare let self: ServiceWorkerGlobalScope;

// eslint-disable-next-line import/no-mutable-exports
export let selfExists: boolean | null = null;

// Robust way to detect if self exists, only once
const detectSelf = () => {
  if (selfExists === null) {
    try {
      if (self) {
        selfExists = true;
      } else {
        selfExists = false;
      }
    } catch (e) {
      selfExists = false;
    }
  }
};
detectSelf();
