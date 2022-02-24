// eslint-disable-next-line import/no-extraneous-dependencies
import { gql } from "@apollo/client";
import {
  MembershipRole,
  Workspace,
  WorkspaceType,
  WorkspacePlan,
} from "@labelflow/graphql-types";
import { v4 as uuidV4 } from "uuid";
import { client, user } from "../../dev/apollo-client";
import { getPrismaClient } from "../../prisma-client";
import { createMembership, createWorkspace } from "../../utils/tests";

// @ts-ignore
fetch.disableFetchMocks();

const testUser1Id = uuidV4();
const testUser2Id = uuidV4();

beforeAll(async () => {
  await (
    await getPrismaClient()
  ).user.create({ data: { id: testUser1Id, name: "test-user-1" } });
  await (
    await getPrismaClient()
  ).user.create({ data: { id: testUser2Id, name: "test-user-2" } });
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

describe("createWorkspace mutation", () => {
  it("fails if the user isn't logged in", async () => {
    user.id = undefined;
    await expect(() =>
      createWorkspace({ name: "should fail" })
    ).rejects.toThrow("Couldn't create workspace: No user id");
  });

  it("fails if the user doesn't exist in the database", async () => {
    user.id = uuidV4();
    await expect(() =>
      createWorkspace({ name: "should fail" })
    ).rejects.toThrow(
      `Couldn't create workspace: User with id "${user.id}" doesn't exist in the database`
    );
  });

  it("fails if no name is provided", async () => {
    await expect(() => createWorkspace({ name: null })).rejects.toThrow();
  });

  it("fails if the name is an empty string", async () => {
    await expect(() => createWorkspace({ name: "" })).rejects.toThrow(
      "Name is empty"
    );
  });

  it("fails if the name contains non-alphanumeric chars is provided", async () => {
    await expect(() => createWorkspace({ name: "Hello!" })).rejects.toThrow(
      "Name contains invalid characters"
    );
  });

  it("fails if the name is reserved", async () => {
    await expect(() => createWorkspace({ name: "pricing" })).rejects.toThrow(
      "This name is reserved"
    );
  });

  it("accepts a name with hyphens, spaces, underscores, and alphanumeric characters", async () => {
    const { data } = await createWorkspace({
      name: "Test with spaces-and-Caps-and-hyphens",
    });
    expect(data.createWorkspace.slug).toEqual(
      "test-with-spaces-and-caps-and-hyphens"
    );
  });

  it("returns the created workspace", async () => {
    const { data } = await createWorkspace();
    expect(data.createWorkspace.name).toEqual("test");
  });

  it("accepts an id", async () => {
    const id = uuidV4();
    const { data } = await createWorkspace({ id });
    expect(data.createWorkspace.id).toEqual(id);
  });

  it("generates a slug based on the workspace name", async () => {
    const { data } = await createWorkspace({
      name: "Test with spaces and Caps",
    });
    expect(data.createWorkspace.slug).toEqual("test-with-spaces-and-caps");
  });

  it("creates a workspace with the Community plan", async () => {
    const { data } = await createWorkspace({
      plan: WorkspacePlan.Community,
    });
    expect(data.createWorkspace.plan).toEqual(WorkspacePlan.Community);
  });

  it("returns a workspace with the Online type", async () => {
    const { data } = await createWorkspace();
    expect(data.createWorkspace.type).toEqual(WorkspaceType.Online);
  });

  it("sets the user who created the workspace as owner", async () => {
    const { data } = await createWorkspace({ name: "test" });
    expect(data.createWorkspace.memberships[0]?.user?.id).toEqual(user.id);
    expect(data.createWorkspace.memberships[0]?.role).toEqual(
      MembershipRole.Owner
    );
  });
});

describe("workspaces query", () => {
  it("returns an empty array when there aren't any", async () => {
    const { data } = await client.query({
      query: gql`
        {
          workspaces {
            id
          }
        }
      `,
      fetchPolicy: "no-cache",
    });
    expect(data.workspaces).toEqual([]);
  });

  it("returns the already created workspaces", async () => {
    await createWorkspace({ name: "test1" });
    await createWorkspace({ name: "test2" });
    await createWorkspace({ name: "test3" });
    await createWorkspace({ name: "test4" });
    const { data } = await client.query<{
      workspaces: Pick<Workspace, "id" | "name">[];
    }>({
      query: gql`
        {
          workspaces {
            id
            name
          }
        }
      `,
      fetchPolicy: "no-cache",
    });
    expect(data.workspaces.map((workspace) => workspace.name)).toEqual([
      "test1",
      "test2",
      "test3",
      "test4",
    ]);
  });

  it("returns an empty array if the user does not have any workspace", async () => {
    await createWorkspace({ name: "test1" });
    await createWorkspace({ name: "test2" });
    await createWorkspace({ name: "test3" });
    await createWorkspace({ name: "test4" });
    user.id = testUser2Id;
    const { data } = await client.query<{
      workspaces: Pick<Workspace, "id" | "name">[];
    }>({
      query: gql`
        {
          workspaces {
            id
            name
          }
        }
      `,
      fetchPolicy: "no-cache",
    });
    expect(data.workspaces.map((workspace) => workspace.name)).toEqual([]);
  });

  it("returns workspaces with the Online type", async () => {
    await createWorkspace({ name: "test1" });
    await createWorkspace({ name: "test2" });
    await createWorkspace({ name: "test3" });
    await createWorkspace({ name: "test4" });
    const { data } = await client.query<{
      workspaces: Pick<Workspace, "id" | "type">[];
    }>({
      query: gql`
        {
          workspaces {
            id
            type
          }
        }
      `,
      fetchPolicy: "no-cache",
    });
    expect(
      data.workspaces.every(
        (workspace) => workspace.type === WorkspaceType.Online
      )
    ).toEqual(true);
  });

  it("can skip results", async () => {
    await createWorkspace({ name: "test1" });
    await createWorkspace({ name: "test2" });
    await createWorkspace({ name: "test3" });
    await createWorkspace({ name: "test4" });
    const { data } = await client.query<{
      workspaces: Pick<Workspace, "id" | "name">[];
    }>({
      query: gql`
        {
          workspaces(skip: 2) {
            id
            name
          }
        }
      `,
      fetchPolicy: "no-cache",
    });
    expect(data.workspaces.map((workspace) => workspace.name)).toEqual([
      "test3",
      "test4",
    ]);
  });

  it("can limit the number of results", async () => {
    await createWorkspace({ name: "test1" });
    await createWorkspace({ name: "test2" });
    await createWorkspace({ name: "test3" });
    await createWorkspace({ name: "test4" });
    const { data } = await client.query<{
      workspaces: Pick<Workspace, "id" | "name">[];
    }>({
      query: gql`
        {
          workspaces(first: 2) {
            id
            name
          }
        }
      `,
      fetchPolicy: "no-cache",
    });
    expect(data.workspaces.map((workspace) => workspace.name)).toEqual([
      "test1",
      "test2",
    ]);
  });

  it("can limit the number of results and also skip some", async () => {
    await createWorkspace({ name: "test1" });
    await createWorkspace({ name: "test2" });
    await createWorkspace({ name: "test3" });
    await createWorkspace({ name: "test4" });
    const { data } = await client.query<{
      workspaces: Pick<Workspace, "id" | "name">[];
    }>({
      query: gql`
        {
          workspaces(first: 2, skip: 1) {
            id
            name
          }
        }
      `,
      fetchPolicy: "no-cache",
    });
    expect(data.workspaces.map((workspace) => workspace.name)).toEqual([
      "test2",
      "test3",
    ]);
  });
});

describe("workspace query", () => {
  it("fails if not provided an id", async () => {
    await expect(() =>
      client.query({
        query: gql`
          {
            workspace {
              id
              name
            }
          }
        `,
        fetchPolicy: "no-cache",
      })
    ).rejects.toThrow();
  });

  it("fails if no workspace match the given id", async () => {
    const idCorrespondingToNoWorkspace = uuidV4();
    await expect(() =>
      client.query({
        query: gql`
          query workspace($id: ID!) {
            workspace(where: { id: $id }) {
              id
              name
            }
          }
        `,
        variables: { id: idCorrespondingToNoWorkspace },
        fetchPolicy: "no-cache",
      })
    ).rejects.toThrow(
      `Couldn't find workspace from input "{"id":"${idCorrespondingToNoWorkspace}"}"`
    );
  });

  it("fails if user is not logged in", async () => {
    const { id } = (await createWorkspace()).data.createWorkspace;
    user.id = undefined;
    await expect(() =>
      client.query({
        query: gql`
          query workspace($id: ID!) {
            workspace(where: { id: $id }) {
              id
              name
            }
          }
        `,
        variables: { id },
        fetchPolicy: "no-cache",
      })
    ).rejects.toThrow(`User not authenticated`);
  });

  it("fails if user does not have access to workspace", async () => {
    const { id } = (await createWorkspace()).data.createWorkspace;
    user.id = testUser2Id;
    await expect(() =>
      client.query({
        query: gql`
          query workspace($id: ID!) {
            workspace(where: { id: $id }) {
              id
              name
            }
          }
        `,
        variables: { id },
        fetchPolicy: "no-cache",
      })
    ).rejects.toThrow(`User not authorized to access workspace`);
  });

  it("returns the workspace corresponding to the id", async () => {
    const { id } = (await createWorkspace()).data.createWorkspace;
    const { data } = await client.query<{
      workspace: Pick<Workspace, "id" | "name">;
    }>({
      query: gql`
        query workspace($id: ID!) {
          workspace(where: { id: $id }) {
            id
            name
          }
        }
      `,
      variables: { id },
      fetchPolicy: "no-cache",
    });
    expect(data.workspace.name).toEqual("test");
  });

  it("returns the workspace with an Online type", async () => {
    const { id } = (await createWorkspace()).data.createWorkspace;
    const { data } = await client.query<{
      workspace: Pick<Workspace, "id" | "type">;
    }>({
      query: gql`
        query workspace($id: ID!) {
          workspace(where: { id: $id }) {
            id
            type
          }
        }
      `,
      variables: { id },
      fetchPolicy: "no-cache",
    });
    expect(data.workspace.type).toEqual(WorkspaceType.Online);
  });
});

describe("updatedWorkspace mutation", () => {
  it("can change the name of a workspace", async () => {
    const id = (await createWorkspace())?.data.createWorkspace.id;
    const { data } = await client.mutate<{
      updateWorkspace: Pick<Workspace, "id" | "name">;
    }>({
      mutation: gql`
        mutation updateWorkspace($id: ID!, $data: WorkspaceUpdateInput!) {
          updateWorkspace(where: { id: $id }, data: $data) {
            id
            name
          }
        }
      `,
      variables: { id, data: { name: "new name" } },
      fetchPolicy: "no-cache",
    });
    expect(data.updateWorkspace.name).toEqual("new name");
  });

  it("fails if the user does not have access to the workspace", async () => {
    const id = (await createWorkspace())?.data.createWorkspace.id;
    user.id = testUser2Id;

    await expect(
      client.mutate<{
        updateWorkspace: Pick<Workspace, "id" | "name">;
      }>({
        mutation: gql`
          mutation updateWorkspace($id: ID!, $data: WorkspaceUpdateInput!) {
            updateWorkspace(where: { id: $id }, data: $data) {
              id
              name
            }
          }
        `,
        variables: { id, data: { name: "new name" } },
        fetchPolicy: "no-cache",
      })
    ).rejects.toThrow("User not authorized to access workspace");
  });

  it("changes the slug is the name of the workspace is changed", async () => {
    const id = (await createWorkspace())?.data.createWorkspace.id;

    const { data } = await client.mutate<{
      updateWorkspace: Pick<Workspace, "id" | "slug">;
    }>({
      mutation: gql`
        mutation updateWorkspace($id: ID!, $data: WorkspaceUpdateInput!) {
          updateWorkspace(where: { id: $id }, data: $data) {
            id
            slug
          }
        }
      `,
      variables: { id, data: { name: "new name" } },
      fetchPolicy: "no-cache",
    });
    expect(data.updateWorkspace.slug).toEqual("new-name");
  });
});

describe("nested resolvers", () => {
  it("can query memberships", async () => {
    const slug = (await createWorkspace()).data.createWorkspace.slug as string;
    const membershipId = (
      await createMembership({
        userId: testUser2Id,
        workspaceSlug: slug,
        role: MembershipRole.Admin,
      })
    ).data.createMembership.id as string;
    const { data } = await client.query<{
      workspace: Pick<Workspace, "id" | "memberships">;
    }>({
      query: gql`
        query workspace($slug: String!) {
          workspace(where: { slug: $slug }) {
            id
            memberships {
              id
            }
          }
        }
      `,
      variables: { slug },
      fetchPolicy: "no-cache",
    });
    // memberships[0] is generated when the workspace is created
    expect(data.workspace.memberships[1].id).toEqual(membershipId);
  });

  it("can query datasets", async () => {
    const id = (await createWorkspace()).data.createWorkspace.id as string;
    const { data } = await client.query<{
      workspace: Pick<Workspace, "id" | "datasets">;
    }>({
      query: gql`
        query workspace($id: ID!) {
          workspace(where: { id: $id }) {
            id
            datasets {
              id
            }
          }
        }
      `,
      variables: { id },
      fetchPolicy: "no-cache",
    });
    expect(data.workspace.datasets).toEqual([]);
  });
});
