import React, { PropsWithChildren } from "react";

// FIXME Remove this file once the following PR are merged and released:
// https://github.com/announcekitapp/announcekit-react/pull/25
// https://github.com/announcekitapp/announcekit-react/pull/26
export type AnnounceKitProps = PropsWithChildren<{
  widget: string;
  lang?: string;
  catchClick?: string;
  widgetStyle?: React.CSSProperties;
  boosters?: boolean;
  floatWidget?: boolean;
  embedWidget?: boolean;
  onWidgetOpen?: Function;
  onWidgetClose?: Function;
  onWidgetResize?: Function;
  labels?: string[];
  userToken?: string;
  onWidgetUnread?: Function;
  user?: {
    id: string;
    [key: string]: any;
  };
  data?: {
    [key: string]: any;
  };
}>;
