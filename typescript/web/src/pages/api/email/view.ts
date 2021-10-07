import { NextApiRequest, NextApiResponse } from "next";

import { generateHtml as signin } from "../../../utils/email/templates/sign-in";
import { generateHtml as signup } from "../../../utils/email/templates/sign-up";

const emailTypes: { [key: string]: typeof signin } = {
  signin,
  signup,
  default: signin,
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query }: { query: { type?: keyof typeof emailTypes } } = req;
  const generateHtml = emailTypes[query?.type ?? "signin"];
  const html = generateHtml(
    query as unknown as Parameters<typeof generateHtml>[0]
  );
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
