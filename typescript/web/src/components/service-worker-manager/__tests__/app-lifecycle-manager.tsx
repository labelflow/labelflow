// /* eslint-disable import/first */

// import { render, screen, waitFor } from "@testing-library/react";
// import { PropsWithChildren } from "react";
// import { ApolloProvider } from "@apollo/client";
// import { ChakraProvider } from "@chakra-ui/react";

// import "@testing-library/jest-dom/extend-expect";
// import type { Workbox } from "workbox-window";

// import {
//   mockUseQueryParams,
//   mockNextRouter,
// } from "../../../utils/router-mocks";

// mockUseQueryParams();
// mockNextRouter({ query: {} });

// import { ServiceWorkerManagerModal } from "../service-worker-manager-modal";
// import { theme } from "../../../theme";
// import { client } from "../../../connectors/apollo-client/schema-client";
// import { setupTestsWithLocalDatabase } from "../../../utils/setup-local-db-tests";

// setupTestsWithLocalDatabase();

// const wrapper = ({ children }: PropsWithChildren<{}>) => (
//   <ApolloProvider client={client}>
//     <ChakraProvider theme={theme} resetCSS>
//       {children}
//     </ChakraProvider>
//   </ApolloProvider>
// );

// describe("App lifecyle manager", () => {
//   beforeEach(() => {
//     jest.resetAllMocks();
//   });

//   test("Should render modal when needed", async () => {
//     window.workbox = {
//       getSW: jest.fn(async () => {
//         return {
//           state: "waiting",
//         };
//       }),
//       addEventListener: jest.fn(() => {}),
//       removeEventListener: jest.fn(() => {}),
//       register: jest.fn(() => {}),
//     } as unknown as Workbox;
//     render(<ServiceWorkerManagerModal />, { wrapper });
//     await waitFor(() => {
//       expect(screen.queryByText("image labeling tool")).toBeDefined();
//     });
//     await waitFor(() => {
//       expect(screen.queryByText("Update available")).not.toBeInTheDocument();
//     });
//   });

//   test("Should not render modal when not needed", async () => {
//     window.workbox = {
//       getSW: jest.fn(async () => {
//         return {
//           state: "activated",
//         };
//       }),
//       addEventListener: jest.fn(() => {}),
//       removeEventListener: jest.fn(() => {}),
//       register: jest.fn(() => {}),
//     } as unknown as Workbox;
//     render(<ServiceWorkerManagerModal />, { wrapper });
//     await waitFor(() => {
//       expect(screen.queryByText("image labeling tool")).not.toBeInTheDocument();
//     });
//     await waitFor(() => {
//       expect(screen.queryByText("Update available")).not.toBeInTheDocument();
//     });
//   });

//   test("Should render update modal when service worker waiting", async () => {
//     let timeout: number;
//     window.workbox = {
//       getSW: jest.fn(async () => {
//         return {
//           state: "activated",
//         };
//       }),
//       addEventListener: jest.fn((eventName, callback: () => void) => {
//         if (eventName === "waiting") {
//           timeout = setTimeout(callback, 10) as unknown as number;
//         }
//       }),
//       removeEventListener: jest.fn((eventName) => {
//         if (eventName === "waiting") {
//           clearTimeout(timeout);
//         }
//       }),
//       register: jest.fn(() => {}),
//     } as unknown as Workbox;
//     render(<ServiceWorkerManagerModal />, { wrapper });
//     await waitFor(() => {
//       expect(screen.queryByText("image labeling tool")).not.toBeInTheDocument();
//     });
//     await waitFor(() => {
//       expect(screen.queryByText("Update available")).toBeDefined();
//     });
//   });
// });
