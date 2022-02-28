import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { isEmpty } from "lodash/fp";

export const UserId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const gqlCtx = GqlExecutionContext.create(ctx);
    const userId = gqlCtx.getContext<GraphQlContext>().req.user?.id;
    if (!isEmpty(userId)) return userId;
    throw new UnauthorizedException("User ID is empty or undefined");
  }
);
