import {
  MockedProvider as ApolloProvider,
  MockedProviderProps,
} from "@apollo/client/testing";
import { ChakraProvider } from "@chakra-ui/react";
import { isNil } from "lodash/fp";
import { SessionProvider } from "next-auth/react";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { useRouter } from "next/router";
import { PropsWithChildren } from "react";
import { QueryParamProvider } from "use-query-params";
import { WildcardMockLink } from "wildcard-mock-link";
import {
  Authenticated,
  AuthenticatedProps,
} from "../../components/auth/authenticated";
import { theme } from "../../theme";
import {
  USER_QUERY_MOCK,
  USER_WITH_WORKSPACES_DATA,
  USER_WITH_WORKSPACES_QUERY_MOCK,
} from "../fixtures/user.fixtures";
import { OptionalParent } from "../optional-parent";
import { ApolloMockResponses, getApolloMockLink } from "./apollo-mock";
import { RouterMock, RouterMockOptions } from "./router-mocks";

export type AuthMockOptions = boolean | Omit<AuthenticatedProps, "children">;

export type DefaultApolloMockOptions = { extraMocks?: ApolloMockResponses };

export type WithMocksApolloOptions = { mocks: ApolloMockResponses };

export type WithLinkApolloOptions = { link: WildcardMockLink };

export type ApolloMockOptions =
  | boolean
  | DefaultApolloMockOptions
  | WithMocksApolloOptions
  | WithLinkApolloOptions;

export type TestWrapperProps = PropsWithChildren<{
  auth?: AuthMockOptions;
  apollo?: ApolloMockOptions;
  router?: RouterMockOptions;
}>;

const hasWorkspaces = (auth: AuthMockOptions | undefined): boolean =>
  typeof auth !== "boolean" && (auth?.withWorkspaces ?? false);

const hasAuth = (auth: AuthMockOptions | undefined): boolean =>
  !isNil(auth) && auth !== false;

export const hasRequiredAuth = (auth: AuthMockOptions | undefined): boolean =>
  (typeof auth === "boolean" && auth) ||
  (typeof auth === "object" && !auth.optional);

type OptionalSessionProps = Pick<TestWrapperProps, "auth" | "children">;

const SessionProviderMock = ({ children }: PropsWithChildren<{}>) => (
  <SessionProvider
    session={{ user: { id: USER_WITH_WORKSPACES_DATA.id } } as any}
  >
    {children}
  </SessionProvider>
);

const OptionalSession = ({ auth, children }: OptionalSessionProps) => (
  <OptionalParent
    enabled={hasAuth(auth) && !isNil(SessionProvider)}
    parent={SessionProviderMock}
    parentProps={{}}
  >
    {children}
  </OptionalParent>
);

const QueryParamProviderMock = ({ children }: PropsWithChildren<{}>) => {
  const router = useRouter();
  return <QueryParamProvider history={router}>{children}</QueryParamProvider>;
};

type OptionalNextRouterProps = Pick<TestWrapperProps, "router" | "children">;

const RouterAndQueryParams = ({
  router,
  children,
}: OptionalNextRouterProps) => (
  <RouterContext.Provider value={new RouterMock(router)}>
    <QueryParamProviderMock>{children}</QueryParamProviderMock>
  </RouterContext.Provider>
);

const OptionalNextRouter = ({ router, children }: OptionalNextRouterProps) => (
  <OptionalParent
    enabled={!isNil(router)}
    parent={RouterAndQueryParams}
    parentProps={{ router }}
  >
    {children}
  </OptionalParent>
);

type GetDefaultApolloMocksOptions = Pick<TestWrapperProps, "auth"> &
  DefaultApolloMockOptions;

const getDefaultApolloMocks = ({
  auth,
  extraMocks = [],
}: GetDefaultApolloMocksOptions): ApolloMockResponses => {
  const authMock: ApolloMockResponses = hasWorkspaces(auth)
    ? [USER_WITH_WORKSPACES_QUERY_MOCK]
    : [USER_QUERY_MOCK];
  return [...authMock, ...extraMocks];
};

export type GetApolloMocksOptions = Pick<TestWrapperProps, "auth"> &
  (DefaultApolloMockOptions | WithMocksApolloOptions);

export const getApolloMocks = ({
  auth,
  ...options
}: GetApolloMocksOptions): ApolloMockResponses | undefined => {
  if ("link" in options) return undefined;
  return "mocks" in options
    ? options.mocks
    : getDefaultApolloMocks({ auth, extraMocks: options.extraMocks });
};

const getApolloLink = (options: GetApolloMocksOptions): WildcardMockLink => {
  const apolloMocks = getApolloMocks(options);
  return getApolloMockLink(apolloMocks);
};

type OptionalApolloProviderProps = Pick<TestWrapperProps, "apollo" | "auth">;

type ApolloProps = Omit<MockedProviderProps, "link"> & {
  link: WildcardMockLink;
};

const getApolloProps = ({
  apollo = true,
  auth,
}: OptionalApolloProviderProps = {}): ApolloProps => {
  if (typeof apollo === "boolean") return { link: getApolloLink({ auth }) };
  return "link" in apollo
    ? apollo
    : { link: getApolloLink({ auth, ...apollo }) };
};

const OptionalApolloProvider = ({ children, ...props }: TestWrapperProps) => (
  <OptionalParent
    enabled={!isNil(props.apollo) && props.apollo !== false}
    parent={(apolloProps) => <ApolloProvider {...apolloProps} />}
    parentProps={getApolloProps(props)}
  >
    {children}
  </OptionalParent>
);

type OptionalAuthProviderProps = Pick<TestWrapperProps, "children" | "auth">;

const OptionalAuthProvider = ({
  children,
  auth = false,
}: OptionalAuthProviderProps) => (
  <OptionalParent
    enabled={!isNil(auth) && auth !== false}
    parent={Authenticated}
    parentProps={typeof auth === "boolean" ? {} : auth}
  >
    {children ?? "NO CHILDREN"}
  </OptionalParent>
);

export const TestWrapper = ({
  apollo,
  auth,
  router,
  children,
}: TestWrapperProps) => (
  <ChakraProvider theme={theme} resetCSS>
    <OptionalSession auth={auth}>
      <OptionalNextRouter router={router}>
        <OptionalApolloProvider apollo={apollo} auth={auth}>
          <OptionalAuthProvider auth={auth}>{children}</OptionalAuthProvider>
        </OptionalApolloProvider>
      </OptionalNextRouter>
    </OptionalSession>
  </ChakraProvider>
);

export type CreateTestWrapperOptions = Omit<TestWrapperProps, "children">;

export type CreateTestWrapperResult = {
  wrapper: (props: PropsWithChildren<{}>) => JSX.Element;
  apolloMockLink: WildcardMockLink;
};

export const createTestWrapper = (
  options?: CreateTestWrapperOptions
): CreateTestWrapperResult => {
  const apolloProps = getApolloProps(options);
  return {
    wrapper: ({ children }) => (
      <TestWrapper {...options}>{children}</TestWrapper>
    ),
    apolloMockLink: apolloProps.link,
  };
};
