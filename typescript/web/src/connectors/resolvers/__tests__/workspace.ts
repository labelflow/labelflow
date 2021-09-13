import { gql } from "@apollo/client";
import { v4 as uuidV4 } from "uuid";
import { Workspace, WorkspaceType } from "@labelflow/graphql-types";

import { client } from "../../apollo-client/schema-client";
import { setupTestsWithLocalDatabase } from "../../../utils/setup-local-db-tests";

setupTestsWithLocalDatabase();

const localWorkspace = { id: "test", name: "test", type: WorkspaceType.Local };

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
      localWorkspace,
    ]);
  });

  it("returns workspaces with the Local type", async () => {
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
        (workspace) => workspace.type === WorkspaceType.Local
      )
    ).toEqual(true);
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
      `Couldn't find a workspace with id: "${idCorrespondingToNoWorkspace}"`
    );
  });

  it("returns the workspace corresponding to the id", async () => {
    const { data } = await client.query<{
      workspace: Pick<Workspace, "id" | "name">;
    }>({
      query: gql`
        query workspace {
          workspace {
            id
            name
          }
        }
      `,

      fetchPolicy: "no-cache",
    });

    expect(data.workspace.name).toEqual(localWorkspace.name);
  });

  it("returns the workspace with an Local type", async () => {
    const { data } = await client.query<{
      workspace: Pick<Workspace, "id" | "type">;
    }>({
      query: gql`
        query workspace {
          workspace {
            id
            type
          }
        }
      `,
      fetchPolicy: "no-cache",
    });

    expect(data.workspace.type).toEqual(WorkspaceType.Local);
  });
});

describe("nested resolvers", () => {
  it("can query datasets", async () => {
    const { data } = await client.query<{
      workspace: Pick<Workspace, "id" | "datasets">;
    }>({
      query: gql`
        query workspace($id: ID!) {
          workspace {
            id
            datasets {
              id
            }
          }
        }
      `,
      fetchPolicy: "no-cache",
    });

    expect(data.workspace.datasets).toEqual([]);
  });
});
