import { useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Meta } from "../../../components/meta";
import { Layout } from "../../../components/layout";
import { AuthManager } from "../../../components/auth-manager";
import { WelcomeModal } from "../../../components/welcome-manager";
import { CookieBanner } from "../../../components/cookie-banner";
import { NavLogo } from "../../../components/logo/nav-logo";
import { UserSettings } from "../../../components/settings/user";
import { userQuery } from "../../../utils/shared-queries";

const updateUserQuery = gql`
  mutation updateUser($id: ID!, $data: UserUpdateInput!) {
    updateUser(where: { id: $id }, data: $data) {
      id
    }
  }
`;

const ProfilePage = () => {
  const session = useSession({ required: false });
  const userInfoFromSession = session?.data?.user;

  const { data: userData, loading } = useQuery(userQuery, {
    variables: { id: userInfoFromSession?.id },
    skip: userInfoFromSession?.id == null,
  });
  const user = userData?.user;
  const [updateUser] = useMutation(updateUserQuery, {
    refetchQueries: ["getUserProfileInfo"],
  });
  const changeUserName = useCallback(
    (name: string) => {
      updateUser({ variables: { id: user?.id, data: { name } } });
    },
    [updateUser, user]
  );
  useEffect(() => {
    if (
      (user == null && loading === false && userInfoFromSession?.id != null) ||
      session.status === "unauthenticated"
    ) {
      throw new Error("User not authenticated");
    }
  }, [user, loading, userInfoFromSession?.id, session.status]);

  return (
    <>
      <WelcomeModal />
      <AuthManager />
      <Meta title="LabelFlow | Profile" />
      <CookieBanner />
      <Layout breadcrumbs={[<NavLogo key={0} />]}>
        {user != null && (
          <UserSettings user={user} changeUserName={changeUserName} />
        )}
      </Layout>
    </>
  );
};

export default ProfilePage;
