// import { incrementMockedDate } from "@labelflow/dev-utils/mockdate";
import gql from "graphql-tag";
import { client } from "../../apollo-client-schema";
import { setupTestsWithLocalDatabase } from "../../../utils/setup-local-db-tests";

setupTestsWithLocalDatabase();

describe("Project resolver test suite", () => {
  test("Create project should return the project id", async () => {
    const name = "My new project";

    const mutationResult = await client.mutate({
      mutation: gql`
        mutation createProject($name: String!) {
          createProject(data: { name: $name }) {
            id
            name
          }
        }
      `,
      variables: {
        name,
      },
    });

    expect(mutationResult.data.createProject.name).toEqual(name);
    expect(typeof mutationResult.data.createProject.id).toEqual("string");
  });

  test("Create project with an id should return the same id", async () => {
    const name = "My new project";
    const projectId = "some id";

    const mutationResult = await client.mutate({
      mutation: gql`
        mutation createProject($projectId: String, $name: String!) {
          createProject(data: { id: $projectId, name: $name }) {
            id
            name
          }
        }
      `,
      variables: {
        name,
        projectId,
      },
    });

    expect(mutationResult.data.createProject.name).toEqual(name);
    expect(mutationResult.data.createProject.id).toEqual(projectId);
  });

  test("Read project", async () => {
    const name = "My new project";
    const projectId = "some id";
    await client.mutate({
      mutation: gql`
        mutation createProject($projectId: String, $name: String!) {
          createProject(data: { id: $projectId, name: $name }) {
            id
            name
          }
        }
      `,
      variables: {
        name,
        projectId,
      },
    });

    const queryResult = await client.query({
      query: gql`
        query getProject($id: ID!) {
          project(where: { id: $id }) {
            id
            name
          }
        }
      `,
      variables: {
        id: projectId,
      },
    });

    expect(queryResult.data.project).toEqual(
      expect.objectContaining({
        id: projectId,
        name,
      })
    );
  });

  test("that it throws when looking for a project that doesn't exist", async () => {
    return expect(
      client.query({
        query: gql`
          query getProject($id: ID!) {
            project(where: { id: $id }) {
              id
              name
            }
          }
        `,
        variables: {
          id: "a id that doesn't exist",
        },
      })
    ).rejects.toThrow("No project with such id");
  });
});
