import { Provider } from "next-auth/client";
import { useEffect } from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";

import { AppProps, AppContext } from "next/app";
import { useRouter } from "next/router";

import { ApolloProvider } from "@apollo/client";
import { useCookie } from "next-cookie";

import { ChakraProvider } from "@chakra-ui/react";

import { pageView } from "../utils/google-analytics";
import { theme } from "../theme";
import { client } from "../connectors/apollo-client/client";
import { QueryParamProvider } from "../utils/query-params-provider";
import { isInWindowScope } from "../utils/detect-scope";
import { Meta } from "../components/meta";
import ErrorPage from "./_error";

interface InitialProps {
  assumeServiceWorkerActive: boolean;
  cookie: string;
}

const ErrorFallback = (props: FallbackProps) => {
  return (
    <ChakraProvider theme={theme} resetCSS>
      <QueryParamProvider>
        <ApolloProvider client={client}>
          <ErrorPage {...props} />
        </ApolloProvider>
      </QueryParamProvider>
    </ChakraProvider>
  );
};

const App = (props: AppProps & InitialProps) => {
  const {
    Component,
    pageProps,
    cookie,
    assumeServiceWorkerActive: assumeServiceWorkerActiveFromServer,
  } = props;

  // Google analytics
  // See https://mariestarck.com/add-google-analytics-to-your-next-js-application-in-5-easy-steps/
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      pageView(url);
    };
    // When the component is mounted, subscribe to router changes
    // and log those page views
    router.events.on("routeChangeComplete", handleRouteChange);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  // Cookie set
  // See https://www.npmjs.com/package/next-cookie
  const parsedCookie = useCookie(cookie);
  useEffect(() => {
    const assumeServiceWorkerActiveFromClient = parsedCookie?.get<boolean>(
      "assumeServiceWorkerActive"
    );
    if (!assumeServiceWorkerActiveFromServer) {
      if (!assumeServiceWorkerActiveFromClient && isInWindowScope) {
        console.warn(
          "Set the cookie client side in browser because it was not set with server http response. This should not happen"
        );
        parsedCookie?.set("assumeServiceWorkerActive", true, {
          path: "/",
          httpOnly: false,
          maxAge: 315569260000, // 10years
          expires: new Date(Date.now() + 315569260000),
          sameSite: "strict",
        });
      }
    }
  }, [parsedCookie, assumeServiceWorkerActiveFromServer]);
  console.log(`pageProps = ${JSON.stringify(pageProps,null, 1)}`);

  return (
    <Provider
      // Provider options are not required but can be useful in situations where
      // you have a short session maxAge time. Shown here with default values.
      options={{
        // Client Max Age controls how often the useSession in the client should
        // contact the server to sync the session state. Value in seconds.
        // e.g.
        // * 0  - Disabled (always use cache value)
        // * 60 - Sync session state with server if it's older than 60 seconds
        clientMaxAge: 0,
        // Keep Alive tells windows / tabs that are signed in to keep sending
        // a keep alive request (which extends the current session expiry) to
        // prevent sessions in open windows from expiring. Value in seconds.
        //
        // Note: If a session has expired when keep alive is triggered, all open
        // windows / tabs will be updated to reflect the user is signed out.
        keepAlive: 0,
      }}
      session={pageProps.session}
    >
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <ChakraProvider theme={theme} resetCSS>
          <QueryParamProvider>
            <ApolloProvider client={client}>
              <Meta />
              <Component
                {...pageProps}
                cookie={cookie}
                assumeServiceWorkerActive={assumeServiceWorkerActiveFromServer}
              />
            </ApolloProvider>
          </QueryParamProvider>
        </ChakraProvider>
      </ErrorBoundary>
    </Provider>
  );
};

App.getInitialProps = async (context: AppContext): Promise<InitialProps> => {
  const { ctx } = context;
  const parsedCookie = useCookie(ctx);

  const assumeServiceWorkerActive = parsedCookie.get<boolean>(
    "assumeServiceWorkerActive"
  );

  // parsedCookie?.set(...) would throw an error when used in SSG context
  // The following condition checks that we are not doing SSG
  if (ctx?.res?.getHeader?.("Set-Cookie") == null) {
    // Set the cookie via http response
    parsedCookie?.set("assumeServiceWorkerActive", true, {
      path: "/",
      httpOnly: false,
      maxAge: 315569260000, // 10years
      expires: new Date(Date.now() + 315569260000),
      sameSite: "strict",
    });
  }

  return {
    assumeServiceWorkerActive: assumeServiceWorkerActive ?? false,
    cookie: ctx?.req?.headers?.cookie ?? "",
  };
};

export default App;
