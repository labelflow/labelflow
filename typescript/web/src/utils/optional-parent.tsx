import { PropsWithChildren } from "react";

export type OptionalParentProps<
  TParentProps extends object | undefined,
  TParentPropsWithChildren = PropsWithChildren<TParentProps>
> = PropsWithChildren<{
  enabled: boolean;
  parent: (props: TParentPropsWithChildren) => JSX.Element | null;
  parentProps: TParentProps;
}>;

export const OptionalParent = <TParentProps extends object | undefined>({
  enabled,
  parent: Parent,
  parentProps,
  children,
}: OptionalParentProps<TParentProps>) => (
  <>{enabled ? <Parent {...parentProps}>{children}</Parent> : children}</>
);
