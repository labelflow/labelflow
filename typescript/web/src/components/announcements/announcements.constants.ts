/** URL of the AnnounceKit widget to use for all labels (optional configuration) */
export const ANNOUNCEKIT_URL =
  process.env.NEXT_PUBLIC_ANNOUNCEKIT_ANNOUNCEMENT_URL;

/** URL of the AnnounceKit widget to use only for the warning label (optional configuration) */
export const ANNOUNCEKIT_WARNING_URL =
  process.env.NEXT_PUBLIC_ANNOUNCEKIT_WARNING_URL || ANNOUNCEKIT_URL;

/** Refresh interval between 2 calls of the AnnounceKit unread function */
export const ANNOUNCEKIT_UNREAD_REFRESH_INTERVAL = 60 * 30 * 1000;
