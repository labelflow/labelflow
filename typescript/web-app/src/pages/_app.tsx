import { AppProps } from "next/app";
import { useEffect, useState, useRef } from "react";
import { ApolloProvider } from "@apollo/client";

import {
  ChakraProvider,
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";

import type { Workbox } from "workbox-window";
import { theme } from "../theme";
import { client } from "../connectors/apollo-client-service-worker";

declare global {
  interface Window {
    workbox: Workbox;
  }
}

function App({ Component, pageProps }: AppProps) {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef<HTMLButtonElement>(null);

  // This hook only run once in browser after the component is rendered for the first time.
  // It has same effect as the old componentDidMount lifecycle callback.
  // See https://github.com/shadowwalker/next-pwa/blob/master/examples/lifecycle/pages/index.js
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      window.workbox !== undefined
    ) {
      const wb = window.workbox;

      // add event listeners to handle any of PWA lifecycle event
      // https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-window.Workbox#events
      wb.addEventListener("redundant", () => {
        window.location.reload();
      });

      // A common UX pattern for progressive web apps is to show a banner when a service worker has updated and waiting to install.
      // NOTE: MUST set skipWaiting to false in next.config.js pwa object
      // https://developers.google.com/web/tools/workbox/guides/advanced-recipes#offer_a_page_reload_for_users
      const promptNewVersionAvailable = (/* event: any */) => {
        setIsOpen(true);
      };

      wb.addEventListener("waiting", promptNewVersionAvailable);

      // never forget to call register as auto register is turned off in next.config.js
      wb.register();
    }
  }, []);

  return (
    <ApolloProvider client={client}>
      <ChakraProvider theme={theme} resetCSS>
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Update available
              </AlertDialogHeader>

              <AlertDialogBody>
                A newer version of Labelflow is available, would you like to
                update and reload the page?
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button
                  ref={cancelRef}
                  onClick={() => {
                    console.log(
                      "User rejected to reload the web app, keep using old version. New version will be automatically loaded when the user opens the app next time."
                    );
                    onClose();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  colorScheme="brand"
                  onClick={() => {
                    if (
                      typeof window !== "undefined" &&
                      "serviceWorker" in navigator &&
                      window.workbox !== undefined
                    ) {
                      const wb = window.workbox;
                      wb.addEventListener("controlling", (/* event: any */) => {
                        window.location.reload();
                      });

                      // Send a message to the waiting service worker, instructing it to activate.
                      wb.messageSkipWaiting();
                    }

                    onClose();
                  }}
                  ml={3}
                >
                  Update and Reload
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
        <Component {...pageProps} />
      </ChakraProvider>
    </ApolloProvider>
  );
}

export default App;
