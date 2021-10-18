import { v4 as uuidv4 } from "uuid";
import { PrismaClient } from "@prisma/client";
import { MembershipRole } from "@labelflow/graphql-types";
import { createTransport } from "nodemailer";
import { generateHtml } from "./templates/invitation";

export enum InvitationStatus {
  Sent,
  UserAlreadyIn,
  Error,
}

export const sendInvitationFromPrisma =
  (prisma: PrismaClient) =>
  async ({
    sessionToken,
    inviterId,
    inviteeEmail,
    inviteeRole,
    workspaceSlug,
    providerServer,
    providerFrom,
  }: {
    sessionToken: string;
    inviterId: string;
    inviteeEmail: string;
    inviteeRole: MembershipRole;
    workspaceSlug: string;
    providerServer: string;
    providerFrom: string;
  }) => {
    const isSessionTokenValid = await prisma.session.count({
      where: {
        AND: [
          { userId: inviterId },
          { sessionToken: { equals: sessionToken } },
        ],
      },
    });
    const inviter = await prisma.user.findUnique({
      where: { id: inviterId },
      select: { name: true, email: true },
    });
    const workspace = await prisma.workspace.findUnique({
      where: { slug: workspaceSlug },
      select: { name: true },
    });
    if (!isSessionTokenValid || !inviter) {
      return InvitationStatus.Error;
    }
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
    const searchParams = new URLSearchParams({
      sessionToken,
      inviterId,
      inviteeEmail,
      inviteeRole,
      workspaceSlug,
      providerServer,
      providerFrom,
    });
    const url = `${
      process.env.NEXTAUTH_URL
    }/api/accept-invitation?${searchParams.toString()}`;
    const transport = createTransport(providerServer);
    await transport.sendMail({
      to: inviteeEmail,
      from: providerFrom,
      subject: `Join ${workspace?.name} on LabelFlow`,
      text: `Join ${workspace?.name} on LabelFlow\n${url}\n\n`,
      html: generateHtml({
        inviterName: inviter?.name ?? undefined,
        inviterEmail: inviter?.email ?? undefined,
        url,
        origin,
        workspaceName: workspace?.name ?? "undefined workspace",
        type: "invitation",
      }),
    });
    return InvitationStatus.Sent;
  };
