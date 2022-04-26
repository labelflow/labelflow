import { isNil } from "lodash/fp";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { PropsWithChildren, useEffect } from "react";
import { useOptionalWorkspaces, UserProvider, useUser } from "../../hooks";

const getSignInUrl = () => {
  const path = "/auth/signin";
  const encodedLocation = encodeURIComponent(window.location.href);
  const searchParams = `redirect=${encodedLocation}`;
  return `${path}?${searchParams}`;
};

export type AuthenticatedProps = PropsWithChildren<{
  optional?: boolean;
  withWorkspaces?: boolean;
}>;

const Body = ({ optional, withWorkspaces, children }: AuthenticatedProps) => {
  const user = useUser();
  const workspaces = useOptionalWorkspaces();
  const hasChildren =
    optional || (!isNil(user) && (!withWorkspaces || !isNil(workspaces)));
  return <>{hasChildren && <>{children}</>}</>;
};

export const Authenticated = (props: AuthenticatedProps) => {
  const { optional, withWorkspaces } = props;
  const router = useRouter();
  const { status } = useSession();
  useEffect(() => {
    if (!optional && status === "unauthenticated") {
      const url = getSignInUrl();
      router.push(url);
    }
  }, [optional, router, status]);
  return (
    <>
      {(status === "authenticated" || optional) && (
        <UserProvider withWorkspaces={withWorkspaces}>
          <Body {...props} />
        </UserProvider>
      )}
    </>
  );
};
