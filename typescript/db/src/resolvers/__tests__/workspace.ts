import { gql } from "@apollo/client";
import { v4 } from "uuid";
import { prisma } from "../../repository";
import { client, user } from "../../dev/apollo-client";

// @ts-ignore
fetch.disableFetchMocks();

beforeAll(async () => {
  user.id = v4();
  await prisma.user.create({ data: { id: user.id, name: "test" } });
});

beforeEach(async () => {
  await prisma.membership.deleteMany({});
  await prisma.workspace.deleteMany({});
});

test("workspaces returns an empty array when there aren't any", async () => {
  const { data } = await client.query({
    query: gql`
      {
        workspaces {
          id
        }
      }
    `,
  });

  expect(data.workspaces).toEqual([]);
});

test("createWorkspace returns the created workspace", async () => {
  const { data } = await client.mutate({
    mutation: gql`
      mutation {
        createWorkspace(data: { name: "test" }) {
          id
          name
        }
      }
    `,
  });
  expect(data.createWorkspace.name).toEqual("test");
});
