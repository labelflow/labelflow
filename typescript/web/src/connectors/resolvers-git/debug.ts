import { detect } from "detect-browser";

import {
  isInWindowScope,
  isInServiceWorkerScope,
  isDevelopmentEnvironment,
} from "../../utils/detect-scope";

declare let self: ServiceWorkerGlobalScope;

const debug = async (): Promise<any> => {
  // eslint-disable-next-line no-underscore-dangle
  // @ts-ignore
  const { WB_MANIFEST } = self ?? {};

  return {
    serverType: "Git-Based LabelFlow Service Worker Server",
    isInWindowScope,
    isInServiceWorkerScope,
    isDevelopmentEnvironment,
    browser: { ...detect() },
    env: {
      ...process.env,
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV,
      NEXT_PUBLIC_VERCEL_ENV: process.env.NEXT_PUBLIC_VERCEL_ENV,
      NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,
      NEXT_PUBLIC_VERCEL_GIT_PROVIDER:
        process.env.NEXT_PUBLIC_VERCEL_GIT_PROVIDER,
      NEXT_PUBLIC_VERCEL_GIT_REPO_SLUG:
        process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_SLUG,
      NEXT_PUBLIC_VERCEL_GIT_REPO_OWNER:
        process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_OWNER,
      NEXT_PUBLIC_VERCEL_GIT_REPO_ID:
        process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_ID,
      NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF:
        process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF,
      NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA:
        process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
      NEXT_PUBLIC_VERCEL_GIT_COMMIT_MESSAGE:
        process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_MESSAGE,
      NEXT_PUBLIC_VERCEL_GIT_COMMIT_AUTHOR_LOGIN:
        process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_AUTHOR_LOGIN,
      NEXT_PUBLIC_VERCEL_GIT_COMMIT_AUTHOR_NAME:
        process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_AUTHOR_NAME,
    },
    WB_MANIFEST,
  };
};

export default {
  Query: {
    debug,
  },
};
