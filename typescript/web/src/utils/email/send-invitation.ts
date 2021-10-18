import { v4 as uuidv4 } from "uuid";
import { PrismaClient } from "@prisma/client";
import { MembershipRole } from "@labelflow/graphql-types";
import { createTransport } from "nodemailer";
import { generateHtml } from "./templates/invitation";

export type InvitationEmailInputs = {
  origin: string;
  inviterName?: string;
  inviterEmail?: string;
  inviteeEmail: string;
  inviteeRole: MembershipRole;
  workspaceSlug: string;
  providerServer: string;
  providerFrom: string;
};

export enum InvitationStatus {
  Sent,
  UserAlreadyIn,
  Error,
}

export const sendInvitationFromPrisma =
  (prisma: PrismaClient) =>
  async ({
    origin,
    inviterName,
    inviterEmail,
    inviteeEmail,
    inviteeRole,
    workspaceSlug,
    providerServer,
    providerFrom,
  }: InvitationEmailInputs) => {
    const workspace = await prisma.workspace.findUnique({
      where: { slug: workspaceSlug },
      select: { name: true },
    });
    if (!workspace) {
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
      invitationToken,
    });
    const url = `${origin}/api/accept-invitation?${searchParams.toString()}`;
    const transport = createTransport(providerServer);
    await transport.sendMail({
      to: inviteeEmail,
      from: providerFrom,
      subject: `Join ${workspace?.name} on LabelFlow`,
      text: `Join ${workspace?.name} on LabelFlow\n${url}\n\n`,
      html: generateHtml({
        inviterName: inviterName ?? undefined,
        inviterEmail: inviterEmail ?? undefined,
        url,
        origin,
        workspaceName: workspace?.name ?? "undefined workspace",
        type: "invitation",
      }),
    });
    return InvitationStatus.Sent;
  };
