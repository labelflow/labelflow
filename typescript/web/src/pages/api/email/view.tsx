import { NextApiRequest, NextApiResponse } from "next";

import { generateHtml as activation } from "../../../utils/email/templates/activation";
import { generateHtml as signin } from "../../../utils/email/templates/sign-in";

const emailTypes: { [key: string]: typeof activation } = {
  activation,
  signin,
  default: activation,
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query }: { query: { type?: keyof typeof emailTypes } } = req;
  const generateHtml = emailTypes[query?.type ?? "activation"];
  const html = generateHtml(
    query as unknown as Parameters<typeof generateHtml>[0]
  );
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
