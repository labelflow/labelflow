import { useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Meta } from "../../../components/meta";
import { Layout } from "../../../components/layout";
import { Authenticated } from "../../../components/auth";
import { WelcomeModal } from "../../../components/welcome-manager";
import { CookieBanner } from "../../../components/cookie-banner";
import { NavLogo } from "../../../components/logo/nav-logo";
import { UserSettings } from "../../../components/settings/user";

const updateUserQuery = gql`
  mutation updateUser($id: ID!, $data: UserUpdateInput!) {
    updateUser(where: { id: $id }, data: $data) {
      id
    }
  }
`;

const userQuery = gql`
  query getUserProfileInfo($id: ID!) {
    user(where: { id: $id }) {
      id
      createdAt
      name
      email
      image
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
    <Authenticated>
      <WelcomeModal />
      <Meta title="LabelFlow | Profile" />
      <CookieBanner />
      <Layout breadcrumbs={[<NavLogo key={0} />]}>
        {user != null && (
          <UserSettings user={user} changeUserName={changeUserName} />
        )}
      </Layout>
    </Authenticated>
  );
};

export default ProfilePage;
