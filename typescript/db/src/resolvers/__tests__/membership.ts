// eslint-disable-next-line import/no-extraneous-dependencies
import { gql } from "@apollo/client";
import { v4 as uuidV4 } from "uuid";
import {
  Membership,
  MembershipRole,
  MutationCreateMembershipArgs,
  MutationCreateWorkspaceArgs,
  Workspace,
} from "@labelflow/graphql-types";
import { getPrismaClient } from "../../prisma-client";
import { client, user } from "../../dev/apollo-client";

// @ts-ignore
fetch.disableFetchMocks();

const testUser1Id = uuidV4();
const testUser2Id = uuidV4();
const testUser3Id = uuidV4();

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

const createWorkspace = async (
  data?: Partial<MutationCreateWorkspaceArgs["data"]>
) => {
  return await client.mutate<{
    createWorkspace: Pick<Workspace, "id" | "name" | "slug" | "plan" | "type">;
  }>({
    mutation: gql`
      mutation createWorkspace($data: WorkspaceCreateInput!) {
        createWorkspace(data: $data) {
          id
          name
          slug
          plan
          type
        }
      }
    `,
    variables: { data: { ...data, name: data?.name ?? "test" } },
  });
};

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

  it("throws if the user can't access membership", async () => {
    const workspaceSlug = (await createWorkspace()).data?.createWorkspace
      .slug as string;

    const membershipId = (
      await createMembership({
        userId: testUser2Id,
        workspaceSlug,
        role: MembershipRole.Member,
      })
    )?.data?.createMembership.id as string;
    user.id = uuidV4();
    await expect(() => queryMembership(membershipId)).rejects.toThrow(
      `User not authorized to access membership`
    );
  });

  it("throws if the provided id doesn't match any membership", async () => {
    const idOfAMembershipThaDoesNotExist = uuidV4();

    await expect(() =>
      queryMembership(idOfAMembershipThaDoesNotExist)
    ).rejects.toThrow(`User not authorized to access membership`);
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

describe("nested resolvers", () => {
  it("can return the user of the membership ", async () => {
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

    expect(data.membership.user.id).toEqual(testUser2Id);
  });

  it("can return the workspace of the membership ", async () => {
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
