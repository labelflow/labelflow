import { Meta } from "../../components/meta";
import { LocalWorkspaceFallback } from "../../components/workspaces";
import { APP_NAME } from "../../constants";
import { UserProvider } from "../../hooks";

const Page = () => (
  <UserProvider withWorkspaces>
    <Meta title={`${APP_NAME} | Discontinued`} />
    <LocalWorkspaceFallback />
  </UserProvider>
);

export default Page;
