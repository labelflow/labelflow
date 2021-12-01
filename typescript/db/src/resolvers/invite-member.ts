import "isomorphic-fetch";

import {
  MutationInviteMemberArgs,
  InvitationResult,
} from "@labelflow/graphql-types";

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
  const inviterMembership = await (
    await getPrismaClient()
  ).membership.findMany({
    where: { AND: [{ userId: user?.id }, { workspaceSlug }] },
  });
  if (!workspace || !inviterMembership) {
    return InvitationResult.Error;
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
    return InvitationResult.UserAlreadyIn;
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
  let membershipId;
  if (!membershipAlreadyExists) {
    // Create that membership
    const membership = await (
      await getPrismaClient()
    ).membership.create({
      data: {
        role: inviteeRole,
        workspaceSlug,
        invitationEmailSentTo: inviteeEmail,
      },
      select: { id: true },
    });

    membershipId = membership.id;
  } else {
    // Update that membership
    const membership = await (
      await getPrismaClient()
    ).membership.update({
      where: { id: membershipAlreadyExists.id },
      data: {
        role: inviteeRole,
      },
      select: { id: true },
    });
    membershipId = membership.id;
  }

  const inputsInvitation = {
    ...{
      inviteeEmail,
      workspaceName: workspace.name,
      workspaceSlug,
      membershipId,
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
      { headers: { cookie: (req?.headers as any).cookie, origin } }
    );
    if (result.status !== 200) {
      throw new Error(`Not signed in.`);
    }
  } catch (e) {
    // console.error(`Failed sending email with error ${e}`);
    return InvitationResult.Error;
  }

  // Query api route to send email
  return InvitationResult.Sent;
};

export default {
  Mutation: {
    inviteMember,
  },
};
