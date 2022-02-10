import { User } from "@prisma/client";
import { encode as jwtEncode, JWT } from "next-auth/jwt";
import { v4 as uuid } from "uuid";

const createJwtToken = (user: User): JWT => {
  const iat = new Date().getTime();
  return {
    name: user.name,
    email: user.email,
    picture: null,
    sub: user.id,
    iat,
    // next-auth default maxAge
    exp: iat + 60 * 60 * 1000,
    jti: uuid(),
  };
};

const getJwtSecret = (): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error("Missing required environment variable JWT_SECRET");
  }
  return process.env.JWT_SECRET;
};

export const createJwt = async (user: User): Promise<string> => {
  const token = createJwtToken(user);
  const secret = getJwtSecret();
  return await jwtEncode({ token, secret });
};
