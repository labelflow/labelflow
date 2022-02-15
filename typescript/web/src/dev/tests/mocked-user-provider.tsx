import { PropsWithChildren } from "react";
import { useOptionalUser, UserProvider, UserProviderProps } from "../../hooks";

export type MockUserProviderBodyProps = PropsWithChildren<{
  optional?: boolean;
}>;

const MockedUserProviderBody = ({
  optional,
  children,
}: MockUserProviderBodyProps) => {
  const user = useOptionalUser();
  return <>{optional || (user && <>{children}</>)}</>;
};

export type MockedUserProviderProps = UserProviderProps &
  MockUserProviderBodyProps;

export const MockedUserProvider = ({
  optional,
  children,
  ...props
}: MockedUserProviderProps) => (
  <UserProvider {...props}>
    <MockedUserProviderBody optional={optional}>
      {children}
    </MockedUserProviderBody>
  </UserProvider>
);
