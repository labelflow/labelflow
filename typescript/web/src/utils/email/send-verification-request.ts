import { PrismaClient } from "@prisma/client";
import { createTransport } from "nodemailer";
import { generateHtml as generateHtmlSignin } from "./templates/sign-in";
import { generateHtml as generateHtmlSignup } from "./templates/sign-up";

export const sendVerificationRequestFromPrisma =
  (prisma: PrismaClient) =>
  async ({
    identifier: email,
    url,
    provider: { server, from },
  }: {
    identifier: string;
    url: string;
    provider: { server: any; from?: string };
  }) => {
    const numberValidatedUsersMatchingEmail = await prisma.user.count({
      where: {
        AND: [{ email: { equals: email } }, { emailVerified: { not: null } }],
      },
    });
    const generateHtml = numberValidatedUsersMatchingEmail
      ? generateHtmlSignin
      : generateHtmlSignup;
    const action = numberValidatedUsersMatchingEmail ? "Sign in" : "Sign up";
    const { origin } = new URL(url);
    const transport = createTransport(server);
    await transport.sendMail({
      to: email,
      from,
      subject: `${action} to LabelFlow`,
      text: `${action} to LabelFlow\n${url}\n\n`,
      html: generateHtml({
        url,
        origin,
        type: numberValidatedUsersMatchingEmail ? "signin" : "signup",
      }),
    });
  };
