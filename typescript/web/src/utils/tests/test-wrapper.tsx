import {
  MockedProvider as ApolloProvider,
  MockedProviderProps,
} from "@apollo/client/testing";
import { ChakraProvider } from "@chakra-ui/react";
import {
  act,
  render,
  RenderOptions,
  RenderResult,
} from "@testing-library/react";
import { isNil } from "lodash/fp";
import { PropsWithChildren, ReactElement } from "react";
import { WildcardMockLink } from "wildcard-mock-link";
import {
  Authenticated,
  AuthenticatedProps,
} from "../../components/auth/authenticated";
import { theme } from "../../theme";
import { ApolloMockResponses, getApolloMockLink } from "./apollo-mock";
import {
  USER_QUERY_MOCK,
  USER_WITH_WORKSPACES_QUERY_MOCK,
} from "./user.fixtures";

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
}>;

const hasWorkspaces = (auth: TestWrapperProps["auth"] | undefined): boolean =>
  typeof auth !== "boolean" && (auth?.withWorkspaces ?? false);

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

type GetApolloMocksOptions = Pick<TestWrapperProps, "auth"> &
  (DefaultApolloMockOptions | WithMocksApolloOptions);

const getApolloLink = ({
  auth,
  ...options
}: GetApolloMocksOptions): WildcardMockLink => {
  const apolloMocks =
    "mocks" in options
      ? options.mocks
      : getDefaultApolloMocks({ auth, extraMocks: options.extraMocks });
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

const OptionalApolloProvider = ({ children, ...props }: TestWrapperProps) => {
  return isNil(props.apollo) || props.apollo === false ? (
    <>{children}</>
  ) : (
    <ApolloProvider {...getApolloProps(props)}>{children}</ApolloProvider>
  );
};

type OptionalAuthProviderProps = Pick<TestWrapperProps, "children" | "auth">;

const OptionalAuthProvider = ({
  children,
  auth = false,
}: OptionalAuthProviderProps) => {
  const authProps = typeof auth === "boolean" ? undefined : auth;
  return auth ? (
    <Authenticated {...authProps}>{children ?? "NO CHILDREN"}</Authenticated>
  ) : (
    <>{children}</>
  );
};

export const TestWrapper = ({ apollo, auth, children }: TestWrapperProps) => (
  <ChakraProvider theme={theme} resetCSS>
    <OptionalApolloProvider apollo={apollo} auth={auth}>
      <OptionalAuthProvider auth={auth}>{children}</OptionalAuthProvider>
    </OptionalApolloProvider>
  </ChakraProvider>
);

type CreateTestWrapperResult = {
  wrapper: (props: PropsWithChildren<{}>) => JSX.Element;
  apolloMockLink: WildcardMockLink;
};

export const createTestWrapper = (
  props?: Omit<TestWrapperProps, "children">
): CreateTestWrapperResult => {
  const apolloProps = getApolloProps(props);
  return {
    wrapper: ({ children }) => <TestWrapper {...props}>{children}</TestWrapper>,
    apolloMockLink: apolloProps.link,
  };
};

export type RenderWithWrapperOptions = Omit<TestWrapperProps, "children"> & {
  renderOptions?: Omit<RenderOptions, "wrapper">;
};

export type RenderWithWrapperResult = RenderResult &
  Pick<CreateTestWrapperResult, "apolloMockLink">;

export const renderWithWrapper = async (
  element: ReactElement,
  { renderOptions, ...options }: RenderWithWrapperOptions = {}
): Promise<RenderWithWrapperResult> => {
  const { wrapper, apolloMockLink } = createTestWrapper(options);
  const renderResult = render(element, { wrapper, ...renderOptions });
  await act(() => apolloMockLink.waitForAllResponses());
  return { ...renderResult, apolloMockLink };
};