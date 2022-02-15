import { gql } from "@apollo/client";
import { MembershipRole, User } from "@labelflow/graphql-types";
import { v4 as uuidV4 } from "uuid";
import { client, user as loggedInUser, user } from "../../dev/apollo-client";
import { getPrismaClient } from "../../prisma-client";
import { createMembership, createWorkspace } from "../../utils/tests";

// @ts-ignore
fetch.disableFetchMocks();

const testUser1Id = uuidV4();
const testUser2Id = uuidV4();
const testUser3Id = uuidV4();
const testUser4Id = uuidV4();

beforeEach(async () => {
  await (await getPrismaClient()).membership.deleteMany({});
  await (await getPrismaClient()).workspace.deleteMany({});
  return await (await getPrismaClient()).user.deleteMany({});
});

afterAll(async () => {
  // Needed to avoid having the test process running indefinitely after the test suite has been run
  await (await getPrismaClient()).$disconnect();
});

describe("users query", () => {
  it("returns an empty array when there aren't any", async () => {
    const { data } = await client.query({
      query: gql`
        {
          users {
            id
          }
        }
      `,
      fetchPolicy: "no-cache",
    });

    expect(data.users).toEqual([]);
  });

  it("returns only the current user if he is not linked to any other user through a workspace", async () => {
    await (
      await getPrismaClient()
    ).user.create({
      data: { id: testUser1Id, name: "test-user-1" },
    });
    await (
      await getPrismaClient()
    ).user.create({
      data: { id: testUser2Id, name: "test-user-2" },
    });
    await (
      await getPrismaClient()
    ).user.create({
      data: { id: testUser3Id, name: "test-user-3" },
    });
    await (
      await getPrismaClient()
    ).user.create({
      data: { id: testUser4Id, name: "test-user-4" },
    });
    loggedInUser.id = testUser1Id;
    await createWorkspace();
    const { data } = await client.query<{
      users: Pick<User, "id" | "name">[];
    }>({
      query: gql`
        {
          users {
            id
            name
          }
        }
      `,
      fetchPolicy: "no-cache",
    });

    expect(data.users.map((userData) => userData.name)).toEqual([
      "test-user-1",
    ]);
  });

  it("returns only the users linked to the current user through a workspace", async () => {
    await (
      await getPrismaClient()
    ).user.create({
      data: { id: testUser1Id, name: "test-user-1" },
    });
    await (
      await getPrismaClient()
    ).user.create({
      data: { id: testUser2Id, name: "test-user-2" },
    });
    await (
      await getPrismaClient()
    ).user.create({
      data: { id: testUser3Id, name: "test-user-3" },
    });
    await (
      await getPrismaClient()
    ).user.create({
      data: { id: testUser4Id, name: "test-user-4" },
    });
    loggedInUser.id = testUser1Id;
    const workspaceSlug = (await createWorkspace()).data?.createWorkspace
      .slug as string;
    await createMembership({
      userId: testUser2Id,
      workspaceSlug,
      role: MembershipRole.Admin,
    });
    await createMembership({
      userId: testUser3Id,
      workspaceSlug,
      role: MembershipRole.Admin,
    });
    const { data } = await client.query<{
      users: Pick<User, "id" | "name">[];
    }>({
      query: gql`
        {
          users {
            id
            name
          }
        }
      `,
      fetchPolicy: "no-cache",
    });

    expect(data.users.map((userData) => userData.name)).toEqual([
      "test-user-1",
      "test-user-2",
      "test-user-3",
    ]);
  });

  it("can skip results", async () => {
    await (
      await getPrismaClient()
    ).user.create({
      data: { id: testUser1Id, name: "test-user-1" },
    });
    await (
      await getPrismaClient()
    ).user.create({
      data: { id: testUser2Id, name: "test-user-2" },
    });
    await (
      await getPrismaClient()
    ).user.create({
      data: { id: testUser3Id, name: "test-user-3" },
    });
    await (
      await getPrismaClient()
    ).user.create({
      data: { id: testUser4Id, name: "test-user-4" },
    });
    loggedInUser.id = testUser1Id;
    const workspaceSlug = (await createWorkspace()).data?.createWorkspace
      .slug as string;
    await createMembership({
      userId: testUser2Id,
      workspaceSlug,
      role: MembershipRole.Admin,
    });
    await createMembership({
      userId: testUser3Id,
      workspaceSlug,
      role: MembershipRole.Admin,
    });

    const { data } = await client.query<{
      users: Pick<User, "id" | "name">[];
    }>({
      query: gql`
        {
          users(skip: 1) {
            id
            name
          }
        }
      `,
      fetchPolicy: "no-cache",
    });

    expect(data.users.map((userData) => userData.name)).toEqual([
      "test-user-2",
      "test-user-3",
    ]);
  });

  it("can limit the number of results", async () => {
    await (
      await getPrismaClient()
    ).user.create({
      data: { id: testUser1Id, name: "test-user-1" },
    });
    await (
      await getPrismaClient()
    ).user.create({
      data: { id: testUser2Id, name: "test-user-2" },
    });
    await (
      await getPrismaClient()
    ).user.create({
      data: { id: testUser3Id, name: "test-user-3" },
    });
    await (
      await getPrismaClient()
    ).user.create({
      data: { id: testUser4Id, name: "test-user-4" },
    });
    loggedInUser.id = testUser1Id;
    const workspaceSlug = (await createWorkspace()).data?.createWorkspace
      .slug as string;
    await createMembership({
      userId: testUser2Id,
      workspaceSlug,
      role: MembershipRole.Admin,
    });
    await createMembership({
      userId: testUser3Id,
      workspaceSlug,
      role: MembershipRole.Admin,
    });

    const { data } = await client.query<{
      users: Pick<User, "id" | "name">[];
    }>({
      query: gql`
        {
          users(first: 2) {
            id
            name
          }
        }
      `,
      fetchPolicy: "no-cache",
    });

    expect(data.users.map((userData) => userData.name)).toEqual([
      "test-user-1",
      "test-user-2",
    ]);
  });

  it("can limit the number of results and skip some", async () => {
    await (
      await getPrismaClient()
    ).user.create({
      data: { id: testUser1Id, name: "test-user-1" },
    });
    await (
      await getPrismaClient()
    ).user.create({
      data: { id: testUser2Id, name: "test-user-2" },
    });
    await (
      await getPrismaClient()
    ).user.create({
      data: { id: testUser3Id, name: "test-user-3" },
    });
    await (
      await getPrismaClient()
    ).user.create({
      data: { id: testUser4Id, name: "test-user-4" },
    });
    loggedInUser.id = testUser1Id;
    const workspaceSlug = (await createWorkspace()).data?.createWorkspace
      .slug as string;
    await createMembership({
      userId: testUser2Id,
      workspaceSlug,
      role: MembershipRole.Admin,
    });
    await createMembership({
      userId: testUser3Id,
      workspaceSlug,
      role: MembershipRole.Admin,
    });

    const { data } = await client.query<{
      users: Pick<User, "id" | "name">[];
    }>({
      query: gql`
        {
          users(skip: 1, first: 1) {
            id
            name
          }
        }
      `,
      fetchPolicy: "no-cache",
    });

    expect(data.users.map((userData) => userData.name)).toEqual([
      "test-user-2",
    ]);
  });
});

describe("user query", () => {
  const queryUser = async (id: string) =>
    await client.query<{
      user: Pick<User, "id" | "name">;
    }>({
      query: gql`
        query user($id: ID!) {
          user(where: { id: $id }) {
            id
            name
          }
        }
      `,
      variables: { id },
      fetchPolicy: "no-cache",
    });

  it("returns the user corresponding to the given id", async () => {
    await (
      await getPrismaClient()
    ).user.create({
      data: { id: testUser1Id, name: "test-user-1" },
    });
    loggedInUser.id = testUser1Id;
    await createWorkspace();
    const { data } = await queryUser(testUser1Id);

    expect(data.user.name).toEqual("test-user-1");
  });

  it("throws if the user does not access to the user", async () => {
    await (
      await getPrismaClient()
    ).user.create({
      data: { id: testUser1Id, name: "test-user-1" },
    });
    await (
      await getPrismaClient()
    ).user.create({
      data: { id: testUser2Id, name: "test-user-2" },
    });
    loggedInUser.id = testUser2Id;
    await expect(queryUser(testUser1Id)).rejects.toThrow(
      "User not authorized to access user"
    );
  });

  it("throws if the provided id doesn't match any user", async () => {
    const idOfAnUserThaDoesNotExist = uuidV4();

    await expect(() => queryUser(idOfAnUserThaDoesNotExist)).rejects.toThrow(
      `User not authorized to access user`
    );
  });
});

describe("updateUser mutation", () => {
  const updateUser = async ({
    id,
    name,
    image,
  }: {
    id: string;
    name?: string;
    image?: string;
  }) =>
    await client.mutate<{
      updateUser: Pick<User, "id" | "name">;
    }>({
      mutation: gql`
        mutation updateUser($id: ID!, $data: UserUpdateInput!) {
          updateUser(where: { id: $id }, data: $data) {
            id
            name
            image
          }
        }
      `,
      variables: { id, data: { name, image } },
      fetchPolicy: "no-cache",
    });

  it("can change the user name", async () => {
    await (
      await getPrismaClient()
    ).user.create({
      data: { id: testUser1Id, name: "test-user-1" },
    });
    user.id = testUser1Id;
    const { data } = await updateUser({
      id: testUser1Id,
      name: "New name",
    });

    expect(data?.updateUser.name).toEqual("New name");
  });

  it("can change the user image", async () => {
    await (
      await getPrismaClient()
    ).user.create({
      data: { id: testUser1Id, name: "test-user-1" },
    });
    user.id = testUser1Id;
    const { data } = await updateUser({
      id: testUser1Id,
      name: "New image",
    });

    expect(data?.updateUser.name).toEqual("New image");
  });

  it("throws if a user tries to update another user", async () => {
    await (
      await getPrismaClient()
    ).user.create({
      data: { id: testUser1Id, name: "test-user-1" },
    });
    user.id = testUser2Id;
    await expect(() =>
      updateUser({
        id: testUser1Id,
        name: "New image",
      })
    ).rejects.toThrow("User not authorized to access user");
  });

  it("throws if the membership to update doesn't exist", async () => {
    const idOfAnUserThaDoesNotExist = uuidV4();

    await expect(() =>
      updateUser({
        id: idOfAnUserThaDoesNotExist,
        name: "This will fail anyway",
      })
    ).rejects.toThrow();
  });
});

describe("nested resolvers", () => {
  it("can return user's memberships", async () => {
    await (
      await getPrismaClient()
    ).user.create({
      data: { id: testUser1Id, name: "test-user-1" },
    });
    loggedInUser.id = testUser1Id;
    await createWorkspace({ name: "test" });

    const { data } = await client.query<{
      user: Pick<User, "id" | "memberships">;
    }>({
      query: gql`
        query user($id: ID!) {
          user(where: { id: $id }) {
            id
            memberships {
              id
              workspace {
                id
              }
            }
          }
        }
      `,
      variables: { id: testUser1Id },
      fetchPolicy: "no-cache",
    });

    expect(data.user.memberships.length).toEqual(1);
  });
});
