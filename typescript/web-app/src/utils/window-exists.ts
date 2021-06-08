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
