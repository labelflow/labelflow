import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthGuard } from "@nestjs/passport";
import { NEXT_JWT_AUTH_STRATEGY_ID } from "./constants";

@Injectable()
export class NextJwtAuthGuard extends AuthGuard(NEXT_JWT_AUTH_STRATEGY_ID) {
  private logger = new Logger();

  canActivate(ctx: ExecutionContext) {
    this.logger.verbose("NextJwtPassportStrategy.canActivate", ctx);
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(ctx);
  }

  getRequest(ctx: ExecutionContext) {
    this.logger.verbose("NextJwtPassportStrategy.getRequest", ctx);
    const gqlCtx = GqlExecutionContext.create(ctx);
    return gqlCtx.getContext().req;
  }

  handleRequest<ContextUser>(
    err: Error | undefined,
    user: ContextUser | undefined
  ) {
    this.logger.verbose("NextJwtPassportStrategy.handleRequest", { err, user });
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
