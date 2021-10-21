import { v4 as uuidv4 } from "uuid";
import fetch, { RequestInit } from "node-fetch";

import type { MutationInviteMemberArgs } from "@labelflow/graphql-types";
import { InvitationStatus } from "@labelflow/graphql-types";
import { Context } from "@labelflow/common-resolvers";
import { prisma } from "../repository/prisma-client";

const inviteMember = async (
  _: any,
  args: MutationInviteMemberArgs,
  { user, req }: Context
) => {
  const {
    where: { email: inviteeEmail, role: inviteeRole, workspaceSlug },
  } = args;
  const workspace = await prisma.workspace.findUnique({
    where: { slug: workspaceSlug },
    select: { name: true },
  });
  const membership = await prisma.membership.findMany({
    where: { AND: [{ userId: user?.id }, { workspaceSlug }] },
  });
  if (!workspace || !membership) {
    return InvitationStatus.Error;
  }
  const userFull = await prisma.user.findUnique({
    where: { id: user?.id },
    select: { name: true, email: true },
  });
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
  const inputsInvitation = {
    ...{
      inviteeEmail,
      workspaceName: workspace.name,
      invitationToken,
    },
    ...(userFull?.email && {
      inviterEmail: userFull?.email,
    }),
    ...(userFull?.name && {
      inviterName: userFull?.name,
    }),
  };
  const searchParams = new URLSearchParams(inputsInvitation);
  const origin = (req?.headers as any)?.origin ?? "";
  try {
    const result = await fetch(
      `${origin}/api/email/send-invitation?${searchParams.toString()}`,
      req as unknown as RequestInit
    );
    if (result.status !== 200) {
      throw new Error(`Not signed in.`);
    }
  } catch (e) {
    // console.error(`Failed sending email with error ${e}`);
    return InvitationStatus.Error;
  }
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
  // Query api route to send email
  return InvitationStatus.Sent;
};

export default {
  Mutation: {
    inviteMember,
  },
};
