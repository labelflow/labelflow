import { SetRequired } from "type-fest";
import { mockNextRouter } from "./router-mocks";
import { USER_QUERY_DATA, WORKSPACE_DATA } from "./user.fixtures";

export type MockSessionOptions = {
  status?: "authenticated" | "unauthenticated" | "loading";
  userId?: string;
};

export type MockWorkspaceOptions<TMockSessionOptions = MockSessionOptions> = {
  workspaceSlug?: string;
  datasetSlug?: string;
  session?: TMockSessionOptions;
};

type RequiredMockSessionOptions = Required<MockSessionOptions>;

type RequiredWorkspaceOptions = SetRequired<
  MockWorkspaceOptions<RequiredMockSessionOptions>,
  "workspaceSlug" | "session"
>;

const DEFAULT_OPTIONS: RequiredWorkspaceOptions = {
  workspaceSlug: WORKSPACE_DATA.slug,
  datasetSlug: undefined,
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
  const { workspaceSlug, datasetSlug, session } = getOptions(options);
  const { status } = session;
  mockNextRouter({ query: { workspaceSlug, datasetSlug } });
  const useSession = () => getSession(session);
  jest.mock("next-auth/react", () => ({ useSession, status }));
};
