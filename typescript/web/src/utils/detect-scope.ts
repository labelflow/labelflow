import {
  detect,
  BrowserInfo,
  SearchBotDeviceInfo,
  BotInfo,
  NodeInfo,
  ReactNativeInfo,
} from "detect-browser";

// eslint-disable-next-line import/no-mutable-exports
export let isInWindowScope: boolean | null = null;

export const isDevelopmentEnvironment = process.env.NODE_ENV === "development";

// eslint-disable-next-line import/no-mutable-exports
export let browser:
  | BrowserInfo
  | SearchBotDeviceInfo
  | BotInfo
  | NodeInfo
  | ReactNativeInfo
  | null = null;

// Robust way to detect if window exists, only once
const detectScope = () => {
  if (isInWindowScope === null) {
    try {
      if (window && window instanceof Window) {
        isInWindowScope = true;

        browser = detect();
      } else {
        isInWindowScope = false;
      }
    } catch (e) {
      isInWindowScope = false;
    }
  }
};
detectScope();
