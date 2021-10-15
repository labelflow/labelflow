import { v4 as uuidv4 } from "uuid";
import { PrismaClient } from "@prisma/client";
import { MembershipRole } from "@labelflow/graphql-types";
import { createTransport } from "nodemailer";
import { generateHtml } from "./templates/invitation";

export enum InvitationStatus {
  Sent,
  UserAlreadyIn,
}

export const sendInvitationFromPrisma =
  (prisma: PrismaClient) =>
  async ({
    inviteeEmail,
    inviteeRole,
    inviterEmail,
    inviterName,
    url,
    workspaceSlug,
    workspaceName,
    provider: { server, from },
  }: {
    workspaceSlug: string;
    inviteeEmail: string;
    inviterName: string;
    inviteeRole: MembershipRole;
    inviterEmail: string;
    url: string;
    workspaceName: string;
    provider: { server: any; from?: string };
  }) => {
    const isUserAlreadyInWorkspace = await prisma.membership.count({
      where: {
        AND: [
          { workspaceSlug: { equals: workspaceSlug } },
          { user: { email: { equals: inviteeEmail } } },
        ],
      },
    });
    if (isUserAlreadyInWorkspace) {
      return InvitationStatus.UserAlreadyIn;
    }
    const membershipAlreadyExists = await prisma.membership.findFirst({
      where: {
        AND: [
          { workspaceSlug: { equals: workspaceSlug } },
          { invitationEmailSentTo: { equals: inviteeEmail } },
        ],
      },
      select: {
        id: true,
      },
    });
    const invitationToken = uuidv4();
    if (!membershipAlreadyExists) {
      // Create that membership
      await prisma.membership.create({
        data: {
          role: inviteeRole,
          workspaceSlug,
          invitationEmailSentTo: inviteeEmail,
          invitationToken,
        },
        select: { invitationToken: true },
      });
    } else {
      // Update that membership
      await prisma.membership.update({
        where: { id: membershipAlreadyExists.id },
        data: {
          invitationToken,
          role: inviteeRole,
        },
      });
    }
    const { origin } = new URL(url);
    const transport = createTransport(server);
    await transport.sendMail({
      to: inviteeEmail,
      from,
      subject: `Join ${workspaceName} on LabelFlow`,
      text: `Join ${workspaceName} on LabelFlow\n${url}\n\n`,
      html: generateHtml({
        inviterName,
        inviterEmail,
        url,
        origin,
        workspaceName,
        type: "invitation",
      }),
    });
    return InvitationStatus.Sent;
  };
