import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { DataLoaders } from "./data-loaders";

export const DataLoader = createParamDecorator(
  (_data: never, ctx: ExecutionContext): DataLoaders =>
    GqlExecutionContext.create(ctx).getContext<GraphQlContext>().loaders
);
