import type { Workbox } from "workbox-window";

declare global {
  interface Window {
    clarity?: (event: string) => void;
    workbox: Workbox;
  }

  interface Document {
    msFullscreenEnabled?: boolean;
    fullscreenEnabled?: boolean;
    webkitIsFullScreen?: boolean;
    msFullscreenElement?: HTMLElement;
    exitFullscreen?: () => void;
    msExitFullscreen?: () => void;
    webkitExitFullscreen?: () => void;
  }
  interface HTMLElement {
    webkitRequestFullscreen?: () => void;
    msRequestFullscreen?: () => void;
    requestFullscreen?: () => void;
  }
}
