import { PropsWithChildren } from "react";

export type PropsWithRequiredChildren<TProps = {}> = Required<
  PropsWithChildren<{}>
> &
  TProps;
