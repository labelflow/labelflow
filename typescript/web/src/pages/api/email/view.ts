import { NextApiRequest, NextApiResponse } from "next";

import { generateHtml as signin } from "../../../utils/email/templates/sign-in";
import { generateHtml as signup } from "../../../utils/email/templates/sign-up";
import { generateHtml as invitation } from "../../../utils/email/templates/invitation";

type EmailTypes = {
  signin: typeof signin;
  signup: typeof signup;
  invitation: typeof invitation;
  default: typeof signup;
};

const emailTypes: EmailTypes = {
  signin,
  signup,
  invitation,
  default: signup,
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query }: { query: { type?: keyof typeof emailTypes } } = req;
  const generateHtml = emailTypes[
    query?.type ?? "signup"
  ] as EmailTypes["signin"];
  const html = generateHtml(
    query as unknown as Parameters<typeof generateHtml>[0]
  );
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
