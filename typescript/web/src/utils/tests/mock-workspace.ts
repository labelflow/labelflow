import { SetRequired } from "type-fest";
import { mockUseQueryParams } from "./mock-use-query-params";
import { mockNextRouter } from "./router-mocks";
import { USER_QUERY_DATA, WORKSPACE_DATA } from "../fixtures";

export type MockSessionOptions = {
  status?: "authenticated" | "unauthenticated" | "loading";
  userId?: string;
};

export type MockWorkspaceOptions<TMockSessionOptions = MockSessionOptions> = {
  workspaceSlug?: string;
  queryParams?: Record<string, unknown>;
  session?: TMockSessionOptions;
};

type RequiredMockSessionOptions = Required<MockSessionOptions>;

type RequiredWorkspaceOptions = SetRequired<
  MockWorkspaceOptions<RequiredMockSessionOptions>,
  "workspaceSlug" | "session"
>;

const DEFAULT_OPTIONS: RequiredWorkspaceOptions = {
  workspaceSlug: WORKSPACE_DATA.slug,
  session: {
    status: "authenticated",
    userId: USER_QUERY_DATA.id,
  },
};

const getSession = ({ status, userId }: RequiredMockSessionOptions) => {
  const data =
    status === "authenticated" ? { user: { id: userId } } : undefined;
  return { status, data };
};

const getOptions = (options: MockWorkspaceOptions | undefined) => {
  return {
    ...DEFAULT_OPTIONS,
    ...options,
    session: {
      status: options?.session?.status ?? DEFAULT_OPTIONS.session.status,
      userId: options?.session?.userId ?? DEFAULT_OPTIONS.session.userId,
    },
  };
};

export const mockWorkspace = (options?: MockWorkspaceOptions) => {
  const { workspaceSlug, queryParams, session } = getOptions(options);
  const { status } = session;
  const query = { workspaceSlug, ...queryParams };
  mockUseQueryParams(query);
  mockNextRouter({ query });
  const useSession = () => getSession(session);
  jest.mock("next-auth/react", () => ({ useSession, status }));
};
