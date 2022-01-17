import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { PropsWithChildren, useEffect } from "react";

const getSignInUrl = () => {
  const path = "/auth/signin";
  const encodedLocation = encodeURIComponent(window.location.href);
  const searchParams = `redirect=${encodedLocation}`;
  return `${path}?${searchParams}`;
};

export type AuthenticatedProps = Required<PropsWithChildren<{}>>;

export const Authenticated = ({ children }: AuthenticatedProps) => {
  const router = useRouter();
  const { status } = useSession();
  useEffect(() => {
    if (status === "unauthenticated") {
      const url = getSignInUrl();
      router.push(url);
    }
  }, [router, status]);
  return <>{status !== "authenticated" ? null : children}</>;
};
