import { PropsWithChildren } from "react";
import {
  AnnouncementsProvider,
  AnnouncementsProviderProps,
} from "./announcements.context";

export type AnnouncementsProps = PropsWithChildren<
  Omit<AnnouncementsProviderProps, "children">
>;

export const Announcements = ({ children, ...props }: AnnouncementsProps) => (
  <AnnouncementsProvider {...props}>
    {children ?? <div />}
  </AnnouncementsProvider>
);
