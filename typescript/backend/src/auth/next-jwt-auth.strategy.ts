/* eslint-disable max-classes-per-file */
import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy as NestPassportStrategy } from "@nestjs/passport";
import hkdf from "@panva/hkdf";
import { Request } from "express";
import { jwtDecrypt } from "jose";
import { isEmpty, isNil } from "lodash/fp";
import { ExtractJwt } from "passport-jwt";
import { Strategy as PassportStrategy } from "passport-strategy";
import { JWT_SECRET_ENV, PRODUCTION } from "../constants";
import { NEXT_JWT_AUTH_STRATEGY_ID } from "./constants";

export interface DefaultNextJWT extends Record<string, unknown> {
  name?: string | null;
  email?: string | null;
  picture?: string | null;
  sub?: string;
}

export interface NextJWT extends Record<string, unknown>, DefaultNextJWT {}

const getDerivedEncryptionKey = async (secret: string) =>
  await hkdf("sha256", secret, "", "NextAuth.js Generated Encryption Key", 32);

const extractTokenFromAuthHeaderAsBearerToken = (req: Request): string => {
  const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
  if (!isNil(token)) return token;
  throw new Error("Missing Authorization header");
};

const getJwt = async (
  req: Request,
  secretOrKey: string
): Promise<DefaultNextJWT> => {
  const token = extractTokenFromAuthHeaderAsBearerToken(req);
  const secret = await getDerivedEncryptionKey(secretOrKey);
  const { payload } = await jwtDecrypt(token, secret, {
    clockTolerance: 15,
  });
  return payload;
};

interface GetUserOptions extends DefaultNextJWT {
  sub: NonNullable<DefaultNextJWT["sub"]>;
}

const getUser = ({
  sub,
  name,
  email,
  picture,
}: GetUserOptions): ContextUser => ({
  id: sub,
  name: name ?? undefined,
  email: email ?? undefined,
  image: picture ?? undefined,
});

@Injectable()
export class NextJwtAuthStrategy extends NestPassportStrategy(
  PassportStrategy,
  NEXT_JWT_AUTH_STRATEGY_ID
) {
  private logger = new Logger(NextJwtAuthStrategy.name);

  private jwtSecret: string;

  constructor(private readonly config: ConfigService) {
    super();
    const jwtSecret = config.get(JWT_SECRET_ENV);
    if (isEmpty(jwtSecret)) {
      const msg = `Missing required environment variable ${JWT_SECRET_ENV}`;
      throw new Error(msg);
    }
    this.jwtSecret = jwtSecret;
  }

  async authenticate(req: Request): Promise<void> {
    this.logger.verbose("NextJwtPassportStrategy.authenticate");
    const { sub, ...payloadRest } = await getJwt(req, this.jwtSecret);
    if (isNil(sub) || isEmpty(sub)) {
      this.fail(new UnauthorizedException(), 401);
    } else {
      const user = getUser({ sub, ...payloadRest });
      if (!PRODUCTION) {
        this.logger.debug(user);
      }
      this.success(user);
    }
  }
}
