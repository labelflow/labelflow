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
  ApolloMockResponse,
  ApolloMockResponseResult,
  ApolloMockResponses,
} from "./apollo-mock";
import {
  AuthMockOptions,
  createTestWrapper,
  CreateTestWrapperResult,
  hasRequiredAuth,
  TestWrapperProps,
} from "./test-wrapper";

export type RenderWithWrapperOptions = Omit<TestWrapperProps, "children"> & {
  renderOptions?: RenderOptions;
};

export type RenderWithWrapperResult = RenderResult &
  Pick<CreateTestWrapperResult, "apolloMockLink">;

const waitForAuth = async (
  auth: AuthMockOptions | undefined,
  apolloMockLink: WildcardMockLink
): Promise<void> => {
  if (!hasRequiredAuth(auth)) return;
  await act(() => apolloMockLink.waitForAllResponses());
  await act(() => apolloMockLink.waitForAllResponses());
};

const addExtraWrapper = (
  Wrapper: NonNullable<RenderOptions["wrapper"]>,
  ExtraWrapper: RenderOptions["wrapper"] | undefined
): RenderOptions["wrapper"] =>
  ExtraWrapper
    ? ({ children }: PropsWithChildren<{}>) => (
        <Wrapper>
          <ExtraWrapper>{children}</ExtraWrapper>
        </Wrapper>
      )
    : Wrapper;

export type JestApolloMockResponse<TData, TVariables> = Omit<
  ApolloMockResponse<TData, TVariables>,
  "result"
> & {
  result?: jest.Mock<ApolloMockResponseResult<TData, TVariables>>;
};

export type JestApolloMockResponses = JestApolloMockResponse<any, any>[];

const wrapApolloMockResponseResultWithJest = <TData, TVariables>(
  result: ApolloMockResponseResult<TData, TVariables> | undefined
): jest.Mock<ApolloMockResponseResult<TData, TVariables>> | undefined => {
  if (isNil(result)) return undefined;
  return jest.fn(typeof result === "function" ? result : () => result);
};

const injectJestInApolloMockResult = <TData, TVariables>(
  base: ApolloMockResponse<TData, TVariables>
): JestApolloMockResponse<TData, TVariables> => ({
  ...base,
  result: wrapApolloMockResponseResultWithJest(base.result),
});

export const injectJestInApolloMockResults = (
  mocks: ApolloMockResponses
): JestApolloMockResponses =>
  mocks.map((mock) => injectJestInApolloMockResult(mock));

export const renderWithTestWrapper = async (
  element: ReactElement,
  {
    renderOptions: { wrapper: extraWrapper, ...renderOptions } = {},
    ...options
  }: RenderWithWrapperOptions = {}
): Promise<RenderWithWrapperResult> => {
  const { wrapper: testWrapper, apolloMockLink } = createTestWrapper(options);
  const wrapper = addExtraWrapper(testWrapper, extraWrapper);
  const renderResult = render(element, { wrapper, ...renderOptions });
  await waitForAuth(options.auth, apolloMockLink);
  return { ...renderResult, apolloMockLink };
};
