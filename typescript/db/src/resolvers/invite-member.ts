import { v4 as uuidv4 } from "uuid";
import "isomorphic-fetch";

import type { MutationInviteMemberArgs } from "@labelflow/graphql-types";
import { InvitationStatus } from "@labelflow/graphql-types";
import { Context } from "@labelflow/common-resolvers";
import { getPrismaClient } from "../prisma-client";

const inviteMember = async (
  _: any,
  args: MutationInviteMemberArgs,
  { user, req }: Context
) => {
  const {
    where: { email: inviteeEmail, role: inviteeRole, workspaceSlug },
  } = args;
  const workspace = await (
    await getPrismaClient()
  ).workspace.findUnique({
    where: { slug: workspaceSlug },
    select: { name: true },
  });
  const membership = await (
    await getPrismaClient()
  ).membership.findMany({
    where: { AND: [{ userId: user?.id }, { workspaceSlug }] },
  });
  if (!workspace || !membership) {
    return InvitationStatus.Error;
  }
  const inviter = await (
    await getPrismaClient()
  ).user.findUnique({
    where: { id: user?.id },
    select: { name: true, email: true },
  });
  const isInviteeAlreadyInWorkspace = await (
    await getPrismaClient()
  ).membership.count({
    where: {
      AND: [
        { workspaceSlug: { equals: workspaceSlug } },
        { user: { email: { equals: inviteeEmail } } },
      ],
    },
  });
  if (isInviteeAlreadyInWorkspace) {
    return InvitationStatus.UserAlreadyIn;
  }
  const invitationToken = uuidv4();
  const inputsInvitation = {
    ...{
      inviteeEmail,
      workspaceName: workspace.name,
      invitationToken,
    },
    ...(inviter?.email && {
      inviterEmail: inviter?.email,
    }),
    ...(inviter?.name && {
      inviterName: inviter?.name,
    }),
  };
  const searchParams = new URLSearchParams(inputsInvitation);
  const origin = (req?.headers as any)?.origin ?? "";
  try {
    const result = await fetch(
      `${origin}/api/email/send-invitation?${searchParams.toString()}`,
      req
    );
    if (result.status !== 200) {
      throw new Error(`Not signed in.`);
    }
  } catch (e) {
    // console.error(`Failed sending email with error ${e}`);
    return InvitationStatus.Error;
  }
  const membershipAlreadyExists = await (
    await getPrismaClient()
  ).membership.findFirst({
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
  if (!membershipAlreadyExists) {
    // Create that membership
    await (
      await getPrismaClient()
    ).membership.create({
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
    await (
      await getPrismaClient()
    ).membership.update({
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
