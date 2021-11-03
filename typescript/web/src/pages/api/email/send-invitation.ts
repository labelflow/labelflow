import { getSession } from "next-auth/react";
import { NextApiRequest, NextApiResponse } from "next";
import { createTransport } from "nodemailer";

import { generateHtml } from "../../../utils/email/templates/invitation";

type InvitationEmailInputs = {
  inviterName?: string;
  inviterEmail?: string;
  inviteeEmail: string;
  workspaceName: string;
  invitationToken: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (session) {
    // Signed in
    const {
      query: {
        inviteeEmail,
        inviterEmail,
        inviterName,
        workspaceName,
        invitationToken,
      },
    } = req as unknown as {
      query: InvitationEmailInputs;
    };
    const searchParams = new URLSearchParams({
      invitationToken,
    });
    const origin = process.env.NEXTAUTH_URL ?? "";
    const url = `${origin}/api/accept-invite?${searchParams.toString()}`;
    const transport = createTransport(process.env.EMAIL_SERVER ?? "");
    await transport.sendMail({
      to: inviteeEmail,
      from: process.env.EMAIL_FROM ?? "",
      subject: `Join ${workspaceName} on LabelFlow`,
      text: `Join ${workspaceName} on LabelFlow\n${url}\n\n`,
      html: generateHtml({
        inviterName: inviterName ?? undefined,
        inviterEmail: inviterEmail ?? undefined,
        url,
        origin,
        workspaceName: workspaceName ?? "undefined workspace",
        type: "invitation",
      }),
    });
    res.status(200);
  } else {
    // Not Signed in
    res.status(401);
  }
  res.end();
}
