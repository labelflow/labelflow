import { NextApiRequest } from "next";
import { encode, getToken } from "next-auth/jwt";
import { JWT_SECRET } from "../constants";

export const reEncodeJwt = async (req: NextApiRequest): Promise<string> => {
  const cookieName = "next-auth.session-token";
  const secret = JWT_SECRET;
  const token = await getToken({ cookieName, req, secret, raw: false });
  if (!token) {
    throw new Error("Unauthenticated");
  }
  return await encode({ token, secret, maxAge: 3600 });
};
