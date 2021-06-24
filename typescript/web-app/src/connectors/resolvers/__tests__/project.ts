// import { incrementMockedDate } from "@labelflow/dev-utils/mockdate";
import gql from "graphql-tag";
import { incrementMockedDate } from "@labelflow/dev-utils/mockdate";
import { client } from "../../apollo-client-schema";
import { setupTestsWithLocalDatabase } from "../../../utils/setup-local-db-tests";

setupTestsWithLocalDatabase();

const createProject = (name: string, projectId?: string | null) => {
  return client.mutate({
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
};

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
    createProject(name, projectId);

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

  test("Read multiple projects", async () => {
    await createProject("project 1");
    await createProject("project 2");

    const queryResults = await client.query({
      query: gql`
        query getProjects {
          projects {
            id
            name
          }
        }
      `,
    });
    expect(queryResults.data.projects).toHaveLength(2);
  });

  test("Read multiple projects in order", async () => {
    await createProject("project 1");
    incrementMockedDate(1);
    await createProject("project 2");

    const queryResults = await client.query({
      query: gql`
        query getProjects {
          projects {
            id
            name
          }
        }
      `,
    });
    expect(queryResults.data.projects[0].name).toEqual("project 1");
    expect(queryResults.data.projects[1].name).toEqual("project 2");
  });

  test("Should return no projects when db is empty", async () => {
    const queryResults = await client.query({
      query: gql`
        query getProjects {
          projects {
            id
            name
          }
        }
      `,
    });
    expect(queryResults.data.projects).toHaveLength(0);
  });

  test("Read paginated projects", async () => {
    await createProject("project 1");
    incrementMockedDate(1);
    await createProject("project 2");
    incrementMockedDate(1);
    await createProject("project 3");

    const queryResults = await client.query({
      query: gql`
        query {
          projects(first: 2) {
            id
            name
          }
        }
      `,
    });
    expect(queryResults.data.projects).toHaveLength(2);
    expect(queryResults.data.projects[0].name).toEqual("project 1");
    expect(queryResults.data.projects[1].name).toEqual("project 2");
  });

  test("Read paginated projects with skip", async () => {
    await createProject("project 1");
    incrementMockedDate(1);
    await createProject("project 2");
    incrementMockedDate(1);
    await createProject("project 3");

    const queryResults = await client.query({
      query: gql`
        query {
          projects(first: 2, skip: 1) {
            id
            name
          }
        }
      `,
    });
    expect(queryResults.data.projects).toHaveLength(2);
    expect(queryResults.data.projects[0].name).toEqual("project 2");
    expect(queryResults.data.projects[1].name).toEqual("project 3");
  });
});
