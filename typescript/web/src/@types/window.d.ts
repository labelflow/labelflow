import type { Workbox } from "workbox-window";

declare global {
  interface Window {
    clarity?: (event: string) => void;
    workbox: Workbox;
  }
}
