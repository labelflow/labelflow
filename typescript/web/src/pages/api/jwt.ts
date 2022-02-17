import type { NextApiRequest, NextApiResponse } from "next";
import { reEncodeJwt } from "../../utils";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const encoded = await reEncodeJwt(req);
  res.send(encoded);
};
