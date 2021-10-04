import { createTransport } from "nodemailer";
import { generateHtml } from "./templates/activation";

export const sendVerificationRequest = async ({
  identifier: email,
  url,
  provider: { server, from },
}: {
  identifier: string;
  url: string;
  provider: { server: any; from?: string };
}) => {
  const { origin } = new URL(url);
  const transport = createTransport(server);
  await transport.sendMail({
    to: email,
    from,
    subject: "Sign in to LabelFlow",
    text: `Sign in to LabelFlow\n${url}\n\n`,
    html: generateHtml({
      url,
      origin,
      // Insert invisible space into domains and email address to prevent both the
      // email address and the domain from being turned into a hyperlink by email
      // clients like Outlook and Apple mail, as this is confusing because it seems
      // like they are supposed to click on their email address to sign in.
      email: `${email.replace(/\./g, "&#8203;.")}`,
      type: "activation",
    }),
  });
};
