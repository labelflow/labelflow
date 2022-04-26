import { gql } from "@apollo/client";
import {
  CurrentUserCanAcceptInvitation,
  Membership,
  MembershipRole,
  MembershipStatus,
  MutationCreateMembershipArgs,
} from "@labelflow/graphql-types";
import { v4 as uuidV4 } from "uuid";
import { client, user } from "../../dev/apollo-client";
import { getPrismaClient } from "../../prisma-client";
import { createWorkspace } from "../../utils/tests";

// @ts-ignore
fetch.disableFetchMocks();

const testUser1Id = uuidV4();
const testUser2Id = uuidV4();
const testUser3Id = uuidV4();

const createMembership = async (
  data?: MutationCreateMembershipArgs["data"]
) => {
  return await client.mutate<{
    createMembership: Membership;
  }>({
    mutation: gql`
      mutation createMembership($data: MembershipCreateInput!) {
        createMembership(data: $data) {
          id
          role
        }
      }
    `,
    variables: { data },
  });
};

const acceptInvitation = async (membershipId: string) => {
  return await client.mutate<{
    acceptInvitation: Pick<Membership, "id" | "user">;
  }>({
    mutation: gql`
      mutation acceptInvitation($id: ID!) {
        acceptInvitation(where: { id: $id }) {
          id
          user {
            id
          }
        }
      }
    `,
    variables: { id: membershipId },
    fetchPolicy: "no-cache",
  });
};

const declineInvitation = async (membershipId: string) => {
  return await client.mutate<{
    declineInvitation: Pick<Membership, "id" | "declinedAt">;
  }>({
    mutation: gql`
      mutation declineInvitation($id: ID!) {
        declineInvitation(where: { id: $id }) {
          id
          declinedAt
        }
      }
    `,
    variables: { id: membershipId },
    fetchPolicy: "no-cache",
  });
};

beforeAll(async () => {
  await (
    await getPrismaClient()
  ).user.create({ data: { id: testUser1Id, name: "test-user-1" } });
  await (
    await getPrismaClient()
  ).user.create({ data: { id: testUser2Id, name: "test-user-2" } });
  await (
    await getPrismaClient()
  ).user.create({ data: { id: testUser3Id, name: "test-user-3" } });
});

beforeEach(async () => {
  user.id = testUser1Id;
  await (await getPrismaClient()).membership.deleteMany({});
  return await (await getPrismaClient()).workspace.deleteMany({});
});

afterAll(async () => {
  // Needed to avoid having the test process running indefinitely after the test suite has been run
  await (await getPrismaClient()).$disconnect();
});

describe("createMembership mutation", () => {
  it("throws an error if the user doesn't exist", async () => {
    const workspaceSlug = (await createWorkspace()).data?.createWorkspace
      .slug as string;
    const idOfAnUserThaDoesNotExist = uuidV4();

    await expect(() =>
      createMembership({
        userId: idOfAnUserThaDoesNotExist,
        workspaceSlug,
        role: MembershipRole.Admin,
      })
    ).rejects.toThrow();
  });

  it("throws an error if the workspace doesn't exist", async () => {
    const idOfAWorkspaceThatDoesNotExist = "i-dont-exist";

    await expect(() =>
      createMembership({
        userId: testUser2Id,
        workspaceSlug: idOfAWorkspaceThatDoesNotExist,
        role: MembershipRole.Admin,
      })
    ).rejects.toThrow();
  });

  it("throws an error if the role isn't specified", async () => {
    const workspaceSlug = (await createWorkspace()).data?.createWorkspace
      .slug as string;

    await expect(() =>
      createMembership({
        userId: testUser2Id,
        workspaceSlug,
        // @ts-ignore
        role: null,
      })
    ).rejects.toThrow();
  });

  it("throws an error if the user is already linked to this workspace", async () => {
    const workspaceSlug = (await createWorkspace()).data?.createWorkspace
      .slug as string;

    /* testUser1Id is already linked to this workspace as createWorkspace makes
    testUser1Id the default owner of this workspace  */

    await expect(() =>
      createMembership({
        userId: testUser1Id,
        workspaceSlug,
        role: MembershipRole.Admin,
      })
    ).rejects.toThrow();
  });

  it("creates a membership with the admin role", async () => {
    const workspaceSlug = (await createWorkspace()).data?.createWorkspace
      .slug as string;

    const { data } = await createMembership({
      userId: testUser2Id,
      workspaceSlug,
      role: MembershipRole.Admin,
    });

    expect(data?.createMembership.role).toEqual(MembershipRole.Admin);
  });

  it("creates a membership with the member role", async () => {
    const workspaceSlug = (await createWorkspace()).data?.createWorkspace
      .slug as string;

    const { data } = await createMembership({
      userId: testUser2Id,
      workspaceSlug,
      role: MembershipRole.Member,
    });

    expect(data?.createMembership.role).toEqual(MembershipRole.Member);
  });

  it("accepts an id as input", async () => {
    const workspaceSlug = (await createWorkspace()).data?.createWorkspace
      .slug as string;

    const membershipId = uuidV4();

    const { data } = await createMembership({
      userId: testUser2Id,
      workspaceSlug,
      role: MembershipRole.Member,
      id: membershipId,
    });

    expect(data?.createMembership.id).toEqual(membershipId);
  });

  it("throws an error if the user can't access the workspace", async () => {
    const workspaceSlug = (await createWorkspace()).data?.createWorkspace
      .slug as string;
    user.id = testUser2Id;

    await expect(() =>
      createMembership({
        userId: testUser2Id,
        workspaceSlug,
        role: MembershipRole.Admin,
      })
    ).rejects.toThrow("User not authorized to access workspace");
  });
});

describe("memberships query", () => {
  it("returns an empty array when there aren't any", async () => {
    const { data } = await client.query({
      query: gql`
        {
          memberships {
            id
          }
        }
      `,
      fetchPolicy: "no-cache",
    });

    expect(data.memberships).toEqual([]);
  });

  it("returns the already created memberships", async () => {
    // both this workspaces are linked to testUser1Id by default
    const workspace1Slug = (await createWorkspace({ name: "test1" }))?.data
      ?.createWorkspace.slug as string;
    const workspace2Slug = (await createWorkspace({ name: "test2" }))?.data
      ?.createWorkspace.slug as string;

    await createMembership({
      userId: testUser2Id,
      workspaceSlug: workspace1Slug,
      role: MembershipRole.Member,
    });

    await createMembership({
      userId: testUser2Id,
      workspaceSlug: workspace2Slug,
      role: MembershipRole.Member,
    });

    const { data } = await client.query<{
      memberships: Pick<Membership, "id" | "role">[];
    }>({
      query: gql`
        {
          memberships {
            id
            role
          }
        }
      `,
      fetchPolicy: "no-cache",
    });
    expect(data.memberships.map((workspace) => workspace.role)).toEqual([
      MembershipRole.Owner,
      MembershipRole.Owner,
    ]);
  });

  it("lists only the memberships assigned to the user", async () => {
    // both this workspaces are linked to testUser1Id by default
    (await createWorkspace({ name: "test1" }))?.data?.createWorkspace
      .slug as string;
    (await createWorkspace({ name: "test2" }))?.data?.createWorkspace
      .slug as string;
    user.id = testUser2Id;
    (await createWorkspace({ name: "test3" }))?.data?.createWorkspace
      .slug as string;
    (await createWorkspace({ name: "test4" }))?.data?.createWorkspace
      .slug as string;

    const { data } = await client.query<{
      memberships: Pick<Membership, "id" | "role">[];
    }>({
      query: gql`
        {
          memberships {
            id
            role
          }
        }
      `,
      fetchPolicy: "no-cache",
    });

    expect(data.memberships.map((workspace) => workspace.role)).toEqual([
      MembershipRole.Owner,
      MembershipRole.Owner,
    ]);
  });

  it("gets memberships by workspace slug", async () => {
    // both this workspaces are linked to testUser1Id by default
    const workspace1Slug = (await createWorkspace({ name: "test1" }))?.data
      ?.createWorkspace.slug as string;
    const workspace2Slug = (await createWorkspace({ name: "test2" }))?.data
      ?.createWorkspace.slug as string;

    await createMembership({
      userId: testUser2Id,
      workspaceSlug: workspace1Slug,
      role: MembershipRole.Member,
    });

    await createMembership({
      userId: testUser2Id,
      workspaceSlug: workspace2Slug,
      role: MembershipRole.Member,
    });

    const { data } = await client.query<{
      memberships: Pick<Membership, "id" | "role">[];
    }>({
      query: gql`
        query memberships($workspaceSlug: String) {
          memberships(where: { workspaceSlug: $workspaceSlug }) {
            id
            role
          }
        }
      `,
      fetchPolicy: "no-cache",
      variables: { workspaceSlug: workspace1Slug },
    });
    expect(data.memberships.map((workspace) => workspace.role)).toEqual([
      MembershipRole.Owner,
      MembershipRole.Member,
    ]);
  });

  it("can skip results", async () => {
    // both this workspaces are linked to testUser1Id by default
    (await createWorkspace({ name: "test1" }))?.data?.createWorkspace
      .slug as string;
    (await createWorkspace({ name: "test2" }))?.data?.createWorkspace
      .slug as string;
    user.id = testUser2Id;
    const workspace3Slug = (await createWorkspace({ name: "test3" }))?.data
      ?.createWorkspace.slug as string;
    const workspace4Slug = (await createWorkspace({ name: "test4" }))?.data
      ?.createWorkspace.slug as string;

    await createMembership({
      userId: testUser1Id,
      workspaceSlug: workspace3Slug,
      role: MembershipRole.Member,
    });

    await createMembership({
      userId: testUser1Id,
      workspaceSlug: workspace4Slug,
      role: MembershipRole.Member,
    });
    user.id = testUser1Id;
    const { data } = await client.query<{
      memberships: Pick<Membership, "id" | "role">[];
    }>({
      query: gql`
        {
          memberships(skip: 1) {
            id
            role
          }
        }
      `,
      fetchPolicy: "no-cache",
    });

    expect(data.memberships.map((workspace) => workspace.role)).toEqual([
      MembershipRole.Owner,
      MembershipRole.Member,
      MembershipRole.Member,
    ]);
  });

  it("can limit the number of results", async () => {
    // both this workspaces are linked to testUser1Id by default
    (await createWorkspace({ name: "test1" }))?.data?.createWorkspace
      .slug as string;
    (await createWorkspace({ name: "test2" }))?.data?.createWorkspace
      .slug as string;
    user.id = testUser2Id;
    const workspace3Slug = (await createWorkspace({ name: "test3" }))?.data
      ?.createWorkspace.slug as string;
    const workspace4Slug = (await createWorkspace({ name: "test4" }))?.data
      ?.createWorkspace.slug as string;

    await createMembership({
      userId: testUser1Id,
      workspaceSlug: workspace3Slug,
      role: MembershipRole.Member,
    });

    await createMembership({
      userId: testUser1Id,
      workspaceSlug: workspace4Slug,
      role: MembershipRole.Member,
    });
    user.id = testUser1Id;

    const { data } = await client.query<{
      memberships: Pick<Membership, "id" | "role">[];
    }>({
      query: gql`
        {
          memberships(first: 3) {
            id
            role
          }
        }
      `,
      fetchPolicy: "no-cache",
    });

    expect(data.memberships.map((workspace) => workspace.role)).toEqual([
      MembershipRole.Owner,
      MembershipRole.Owner,
      MembershipRole.Member,
    ]);
  });

  it("can limit the number of results and also skip some", async () => {
    // both this workspaces are linked to testUser1Id by default
    (await createWorkspace({ name: "test1" }))?.data?.createWorkspace
      .slug as string;
    (await createWorkspace({ name: "test2" }))?.data?.createWorkspace
      .slug as string;
    user.id = testUser2Id;
    const workspace3Slug = (await createWorkspace({ name: "test3" }))?.data
      ?.createWorkspace.slug as string;
    const workspace4Slug = (await createWorkspace({ name: "test4" }))?.data
      ?.createWorkspace.slug as string;

    await createMembership({
      userId: testUser1Id,
      workspaceSlug: workspace3Slug,
      role: MembershipRole.Member,
    });

    await createMembership({
      userId: testUser1Id,
      workspaceSlug: workspace4Slug,
      role: MembershipRole.Member,
    });
    user.id = testUser1Id;

    const { data } = await client.query<{
      memberships: Pick<Membership, "id" | "role">[];
    }>({
      query: gql`
        {
          memberships(skip: 1, first: 2) {
            id
            role
          }
        }
      `,
      fetchPolicy: "no-cache",
    });

    expect(data.memberships.map((workspace) => workspace.role)).toEqual([
      MembershipRole.Owner,
      MembershipRole.Member,
    ]);
  });
});

describe("membership query", () => {
  const queryMembership = async (id: string) =>
    await client.query<{
      membership: Pick<Membership, "id">;
    }>({
      query: gql`
        query membership($id: ID!) {
          membership(where: { id: $id }) {
            id
          }
        }
      `,
      variables: { id },
      fetchPolicy: "no-cache",
    });

  it("returns the membership corresponding to the id", async () => {
    const workspaceSlug = (await createWorkspace()).data?.createWorkspace
      .slug as string;

    const membershipId = (
      await createMembership({
        userId: testUser2Id,
        workspaceSlug,
        role: MembershipRole.Member,
      })
    )?.data?.createMembership.id as string;

    user.id = testUser2Id;

    const { data } = await queryMembership(membershipId);

    expect(data.membership.id).toEqual(membershipId);
  });
});

describe("updateMembership mutation", () => {
  const updateMembership = async ({
    id,
    role,
  }: {
    id: string;
    role: MembershipRole;
  }) =>
    await client.mutate<{
      updateMembership: Pick<Membership, "id" | "role">;
    }>({
      mutation: gql`
        mutation updateMembership($id: ID!, $data: MembershipUpdateInput!) {
          updateMembership(where: { id: $id }, data: $data) {
            id
            role
          }
        }
      `,
      variables: { id, data: { role } },
      fetchPolicy: "no-cache",
    });

  it("can change the membership role", async () => {
    const workspaceSlug = (await createWorkspace())?.data?.createWorkspace
      .slug as string;

    const membershipId = (
      await createMembership({
        userId: testUser2Id,
        role: MembershipRole.Admin,
        workspaceSlug,
      })
    ).data?.createMembership.id as string;
    user.id = testUser2Id;
    const { data } = await updateMembership({
      id: membershipId,
      role: MembershipRole.Member,
    });

    expect(data?.updateMembership.role).toEqual(MembershipRole.Member);
  });

  it("throws if the user does not have access to the membership", async () => {
    user.id = testUser3Id;
    const workspaceSlug = (await createWorkspace())?.data?.createWorkspace
      .slug as string;

    const membershipId = (
      await createMembership({
        userId: testUser2Id,
        role: MembershipRole.Admin,
        workspaceSlug,
      })
    ).data?.createMembership.id as string;
    user.id = testUser1Id;
    await expect(
      updateMembership({
        id: membershipId,
        role: MembershipRole.Member,
      })
    ).rejects.toThrow("User not authorized to access membership");
  });

  it("throws if the membership to update doesn't exist", async () => {
    const idOfAMembershipThaDoesNotExist = uuidV4();

    await expect(() =>
      updateMembership({
        id: idOfAMembershipThaDoesNotExist,
        role: MembershipRole.Member,
      })
    ).rejects.toThrow();
  });
});

describe("deleteMembership mutation", () => {
  const deleteMembership = async (membershipId: string) => {
    return await client.mutate<{
      deleteMembership: Pick<Membership, "id">;
    }>({
      mutation: gql`
        mutation deleteMembership($id: ID!) {
          deleteMembership(where: { id: $id }) {
            id
          }
        }
      `,
      variables: { id: membershipId },
      fetchPolicy: "no-cache",
    });
  };

  it("returns the deleted membership", async () => {
    const workspaceSlug = (await createWorkspace())?.data?.createWorkspace
      .slug as string;

    const membershipId = (
      await createMembership({
        userId: testUser2Id,
        role: MembershipRole.Admin,
        workspaceSlug,
      })
    ).data?.createMembership.id as string;
    user.id = testUser2Id;
    const { data } = await deleteMembership(membershipId);

    expect(data?.deleteMembership.id).toEqual(membershipId);
  });

  it("deletes the membership", async () => {
    const workspaceSlug = (await createWorkspace())?.data?.createWorkspace
      .slug as string;
    const membershipId = (
      await createMembership({
        userId: testUser2Id,
        role: MembershipRole.Admin,
        workspaceSlug,
      })
    ).data?.createMembership.id as string;
    user.id = testUser2Id;
    await deleteMembership(membershipId);

    expect(
      (
        await client.query({
          query: gql`
            query memberships {
              memberships {
                id
              }
            }
          `,
          fetchPolicy: "no-cache",
        })
      ).data.memberships.length
    ).toEqual(0);
  });

  it("throws if the user does not have access to the membership", async () => {
    user.id = testUser3Id;
    const workspaceSlug = (await createWorkspace())?.data?.createWorkspace
      .slug as string;

    const membershipId = (
      await createMembership({
        userId: testUser2Id,
        role: MembershipRole.Admin,
        workspaceSlug,
      })
    ).data?.createMembership.id as string;
    user.id = testUser1Id;
    await expect(() => deleteMembership(membershipId)).rejects.toThrow(
      "User not authorized to access membership"
    );
  });

  it("throws if the membership to update doesn't exist", async () => {
    const idOfAMembershipThaDoesNotExist = uuidV4();

    await expect(() =>
      deleteMembership(idOfAMembershipThaDoesNotExist)
    ).rejects.toThrow();
  });
});

describe("declineInvitation mutation", () => {
  it("returns the updated membership with the declinedAt", async () => {
    const workspaceSlug = (await createWorkspace())?.data?.createWorkspace
      .slug as string;

    const membershipId = (
      await createMembership({
        role: MembershipRole.Admin,
        workspaceSlug,
      })
    ).data?.createMembership.id as string;
    user.id = testUser2Id;
    const { data } = await declineInvitation(membershipId);

    expect(data?.declineInvitation?.declinedAt).toBeDefined();
  });

  it("throws if the user isn't logged in", async () => {
    const workspaceSlug = (await createWorkspace())?.data?.createWorkspace
      .slug as string;

    const membershipId = (
      await createMembership({
        role: MembershipRole.Admin,
        workspaceSlug,
      })
    ).data?.createMembership.id as string;
    user.id = undefined;

    await expect(() => declineInvitation(membershipId)).rejects.toThrow(
      "User is not logged in"
    );
  });

  it("throws if the membership doesn't exist", async () => {
    const workspaceSlug = (await createWorkspace())?.data?.createWorkspace
      .slug as string;

    await createMembership({
      role: MembershipRole.Admin,
      workspaceSlug,
    });

    user.id = testUser2Id;

    await expect(() => declineInvitation(uuidV4())).rejects.toThrow(
      "Couldn't find the membership you are trying to accept"
    );
  });

  it("throws if the membership already has a user", async () => {
    const workspaceSlug = (await createWorkspace())?.data?.createWorkspace
      .slug as string;

    const membershipId = (
      await createMembership({
        userId: testUser3Id,
        role: MembershipRole.Admin,
        workspaceSlug,
      })
    ).data?.createMembership.id as string;

    user.id = testUser2Id;

    await expect(() => declineInvitation(membershipId)).rejects.toThrow(
      "This invitation was already accepted by a user"
    );
  });

  it("throws if the membership was already declined", async () => {
    const workspaceSlug = (await createWorkspace())?.data?.createWorkspace
      .slug as string;

    const membershipId = (
      await createMembership({
        role: MembershipRole.Admin,
        workspaceSlug,
      })
    ).data?.createMembership.id as string;

    user.id = testUser2Id;

    await declineInvitation(membershipId);

    await expect(() => declineInvitation(membershipId)).rejects.toThrow(
      "This invitation has already been declined"
    );
  });
});

describe("acceptInvitation mutation", () => {
  it("returns the updated membership with the user", async () => {
    const workspaceSlug = (await createWorkspace())?.data?.createWorkspace
      .slug as string;

    const membershipId = (
      await createMembership({
        role: MembershipRole.Admin,
        workspaceSlug,
      })
    ).data?.createMembership.id as string;
    user.id = testUser2Id;
    const { data } = await acceptInvitation(membershipId);

    expect(data?.acceptInvitation?.user?.id).toEqual(testUser2Id);
  });

  it("throws if the user isn't logged in", async () => {
    const workspaceSlug = (await createWorkspace())?.data?.createWorkspace
      .slug as string;

    const membershipId = (
      await createMembership({
        role: MembershipRole.Admin,
        workspaceSlug,
      })
    ).data?.createMembership.id as string;
    user.id = undefined;

    await expect(() => acceptInvitation(membershipId)).rejects.toThrow(
      "User is not logged in"
    );
  });

  it("throws if the membership doesn't exist", async () => {
    const workspaceSlug = (await createWorkspace())?.data?.createWorkspace
      .slug as string;

    await createMembership({
      role: MembershipRole.Admin,
      workspaceSlug,
    });

    user.id = testUser2Id;

    await expect(() => acceptInvitation(uuidV4())).rejects.toThrow(
      "Couldn't find the membership you are trying to accept"
    );
  });

  it("throws if the membership already has a user", async () => {
    const workspaceSlug = (await createWorkspace())?.data?.createWorkspace
      .slug as string;

    const membershipId = (
      await createMembership({
        userId: testUser3Id,
        role: MembershipRole.Admin,
        workspaceSlug,
      })
    ).data?.createMembership.id as string;

    user.id = testUser2Id;

    await expect(() => acceptInvitation(membershipId)).rejects.toThrow(
      "This invitation was already accepted by a user"
    );
  });

  it("throws if the membership was already declined", async () => {
    const workspaceSlug = (await createWorkspace())?.data?.createWorkspace
      .slug as string;

    const membershipId = (
      await createMembership({
        role: MembershipRole.Admin,
        workspaceSlug,
      })
    ).data?.createMembership.id as string;

    user.id = testUser2Id;

    await declineInvitation(membershipId);

    await expect(() => acceptInvitation(membershipId)).rejects.toThrow(
      "This invitation has already been declined"
    );
  });

  it("throws if the user accepting the invite is already a membership of the workspace", async () => {
    const workspaceSlug = (await createWorkspace())?.data?.createWorkspace
      .slug as string;

    const membershipId = (
      await createMembership({
        role: MembershipRole.Admin,
        workspaceSlug,
      })
    ).data?.createMembership.id as string;

    user.id = testUser1Id;

    await expect(() => acceptInvitation(membershipId)).rejects.toThrow(
      "User cannot accept this invitation as they are already part of this workspace"
    );
  });
});

describe("nested resolvers", () => {
  it("can return the user of the membership", async () => {
    const workspaceSlug = (await createWorkspace({ name: "test" })).data
      ?.createWorkspace.slug as string;

    const membershipId = (
      await createMembership({
        userId: testUser2Id,
        workspaceSlug,
        role: MembershipRole.Admin,
      })
    ).data?.createMembership.id as string;
    user.id = testUser2Id;
    const { data } = await client.query<{
      membership: Pick<Membership, "id" | "user">;
    }>({
      query: gql`
        query membership($id: ID!) {
          membership(where: { id: $id }) {
            id
            user {
              id
            }
          }
        }
      `,
      variables: { id: membershipId },
      fetchPolicy: "no-cache",
    });

    expect(data.membership?.user?.id).toEqual(testUser2Id);
  });

  it("can return the workspace of the membership", async () => {
    const workspaceSlug = (await createWorkspace({ name: "test" })).data
      ?.createWorkspace.slug as string;

    const membershipId = (
      await createMembership({
        userId: testUser2Id,
        workspaceSlug,
        role: MembershipRole.Admin,
      })
    ).data?.createMembership.id as string;
    user.id = testUser2Id;
    const { data } = await client.query<{
      membership: Pick<Membership, "id" | "workspace">;
    }>({
      query: gql`
        query membership($id: ID!) {
          membership(where: { id: $id }) {
            id
            workspace {
              id
              slug
            }
          }
        }
      `,
      variables: { id: membershipId },
      fetchPolicy: "no-cache",
    });

    expect(data.membership.workspace.slug).toEqual(workspaceSlug);
  });
});

describe("membership status", () => {
  it("returns the 'Sent' status if no user has accepted the invite", async () => {
    const workspaceSlug = (await createWorkspace({ name: "test" })).data
      ?.createWorkspace.slug as string;

    const membershipId = (
      await createMembership({
        workspaceSlug,
        role: MembershipRole.Admin,
      })
    ).data?.createMembership.id as string;
    user.id = testUser2Id;

    const { data } = await client.query<{
      membership: Pick<Membership, "id" | "status">;
    }>({
      query: gql`
        query membership($id: ID!) {
          membership(where: { id: $id }) {
            id
            status
          }
        }
      `,
      variables: { id: membershipId },
      fetchPolicy: "no-cache",
    });

    expect(data.membership?.status).toEqual(MembershipStatus.Sent);
  });

  it("returns the 'DeclinedAt' status if it was declined", async () => {
    const workspaceSlug = (await createWorkspace({ name: "test" })).data
      ?.createWorkspace.slug as string;

    const membershipId = (
      await createMembership({
        workspaceSlug,
        role: MembershipRole.Admin,
      })
    ).data?.createMembership.id as string;
    user.id = testUser2Id;

    await declineInvitation(membershipId);

    const { data } = await client.query<{
      membership: Pick<Membership, "id" | "status">;
    }>({
      query: gql`
        query membership($id: ID!) {
          membership(where: { id: $id }) {
            id
            status
          }
        }
      `,
      variables: { id: membershipId },
      fetchPolicy: "no-cache",
    });

    expect(data.membership?.status).toEqual(MembershipStatus.Declined);
  });

  it("returns the 'Active' status if it was accepted", async () => {
    const workspaceSlug = (await createWorkspace({ name: "test" })).data
      ?.createWorkspace.slug as string;

    const membershipId = (
      await createMembership({
        workspaceSlug,
        role: MembershipRole.Admin,
      })
    ).data?.createMembership.id as string;
    user.id = testUser2Id;

    await acceptInvitation(membershipId);

    const { data } = await client.query<{
      membership: Pick<Membership, "id" | "status">;
    }>({
      query: gql`
        query membership($id: ID!) {
          membership(where: { id: $id }) {
            id
            status
          }
        }
      `,
      variables: { id: membershipId },
      fetchPolicy: "no-cache",
    });

    expect(data.membership?.status).toEqual(MembershipStatus.Active);
  });

  it("throws if the user isn't logged in", async () => {
    const workspaceSlug = (await createWorkspace({ name: "test" })).data
      ?.createWorkspace.slug as string;

    const membershipId = (
      await createMembership({
        workspaceSlug,
        role: MembershipRole.Admin,
      })
    ).data?.createMembership.id as string;

    user.id = undefined;

    const query = () =>
      client.query<{
        membership: Pick<Membership, "id" | "status">;
      }>({
        query: gql`
          query membership($id: ID!) {
            membership(where: { id: $id }) {
              id
              status
            }
          }
        `,
        variables: { id: membershipId },
        fetchPolicy: "no-cache",
      });

    await expect(query).rejects.toThrow("User is not logged in");
  });
});

describe("membership currentUserCanAcceptInvitation", () => {
  it("returns 'Yes' if the user can accept the invitation", async () => {
    const workspaceSlug = (await createWorkspace({ name: "test" })).data
      ?.createWorkspace.slug as string;

    const membershipId = (
      await createMembership({
        workspaceSlug,
        role: MembershipRole.Admin,
      })
    ).data?.createMembership.id as string;
    user.id = testUser2Id;

    const { data } = await client.query<{
      membership: Pick<Membership, "id" | "currentUserCanAcceptInvitation">;
    }>({
      query: gql`
        query membership($id: ID!) {
          membership(where: { id: $id }) {
            id
            currentUserCanAcceptInvitation
          }
        }
      `,
      variables: { id: membershipId },
      fetchPolicy: "no-cache",
    });

    expect(data.membership?.currentUserCanAcceptInvitation).toEqual(
      CurrentUserCanAcceptInvitation.Yes
    );
  });

  it("returns 'AlreadyAccepted' if someone already accepted this invitation", async () => {
    const workspaceSlug = (await createWorkspace({ name: "test" })).data
      ?.createWorkspace.slug as string;

    const membershipId = (
      await createMembership({
        // we create a membership which is already accepted
        userId: testUser3Id,
        workspaceSlug,
        role: MembershipRole.Admin,
      })
    ).data?.createMembership.id as string;
    user.id = testUser2Id;

    const { data } = await client.query<{
      membership: Pick<Membership, "id" | "currentUserCanAcceptInvitation">;
    }>({
      query: gql`
        query membership($id: ID!) {
          membership(where: { id: $id }) {
            id
            currentUserCanAcceptInvitation
          }
        }
      `,
      variables: { id: membershipId },
      fetchPolicy: "no-cache",
    });

    expect(data.membership?.currentUserCanAcceptInvitation).toEqual(
      CurrentUserCanAcceptInvitation.AlreadyAccepted
    );
  });

  it("returns 'AlreadyMemberOfTheWorkspace' if someone wants to accept an invitation for a workspace they already belong to", async () => {
    const workspaceSlug = (await createWorkspace({ name: "test" })).data
      ?.createWorkspace.slug as string;

    const membershipId = (
      await createMembership({
        workspaceSlug,
        role: MembershipRole.Admin,
      })
    ).data?.createMembership.id as string;

    // user 1 is already member of this workspace
    user.id = testUser1Id;

    const { data } = await client.query<{
      membership: Pick<Membership, "id" | "currentUserCanAcceptInvitation">;
    }>({
      query: gql`
        query membership($id: ID!) {
          membership(where: { id: $id }) {
            id
            currentUserCanAcceptInvitation
          }
        }
      `,
      variables: { id: membershipId },
      fetchPolicy: "no-cache",
    });

    expect(data.membership?.currentUserCanAcceptInvitation).toEqual(
      CurrentUserCanAcceptInvitation.AlreadyMemberOfTheWorkspace
    );
  });

  it("returns 'AlreadyDeclined' if the invitation was already declined by someone.", async () => {
    const workspaceSlug = (await createWorkspace({ name: "test" })).data
      ?.createWorkspace.slug as string;

    const membershipId = (
      await createMembership({
        workspaceSlug,
        role: MembershipRole.Admin,
      })
    ).data?.createMembership.id as string;

    user.id = testUser2Id;

    await declineInvitation(membershipId);

    const { data } = await client.query<{
      membership: Pick<Membership, "id" | "currentUserCanAcceptInvitation">;
    }>({
      query: gql`
        query membership($id: ID!) {
          membership(where: { id: $id }) {
            id
            currentUserCanAcceptInvitation
          }
        }
      `,
      variables: { id: membershipId },
      fetchPolicy: "no-cache",
    });

    expect(data.membership?.currentUserCanAcceptInvitation).toEqual(
      CurrentUserCanAcceptInvitation.AlreadyDeclined
    );
  });

  it("throw if the user isn't logged in", async () => {
    const workspaceSlug = (await createWorkspace({ name: "test" })).data
      ?.createWorkspace.slug as string;

    const membershipId = (
      await createMembership({
        workspaceSlug,
        role: MembershipRole.Admin,
      })
    ).data?.createMembership.id as string;

    user.id = undefined;

    const query = () =>
      client.query<{
        membership: Pick<Membership, "id" | "currentUserCanAcceptInvitation">;
      }>({
        query: gql`
          query membership($id: ID!) {
            membership(where: { id: $id }) {
              id
              currentUserCanAcceptInvitation
            }
          }
        `,
        variables: { id: membershipId },
        fetchPolicy: "no-cache",
      });

    await expect(query).rejects.toThrow("User is not logged in");
  });
});
