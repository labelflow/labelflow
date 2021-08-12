import { gql } from "@apollo/client";
import { incrementMockedDate } from "@labelflow/dev-utils/mockdate";
import { probeImage } from "@labelflow/common-resolvers/src/utils/probe-image";
import { client } from "../../apollo-client/schema-client";
import { setupTestsWithLocalDatabase } from "../../../utils/setup-local-db-tests";

setupTestsWithLocalDatabase();

jest.mock("@labelflow/common-resolvers/src/utils/probe-image");
const mockedProbeSync = probeImage as jest.Mock;

const createProject = async (name: string, projectId?: string | null) => {
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
    fetchPolicy: "no-cache",
  });
};

const updateProjectWithImageLabelAndClass = async (projectId: string) => {
  await client.mutate({
    mutation: gql`
      mutation createImage($data: ImageCreateInput!) {
        createImage(data: $data) {
          id
        }
      }
    `,
    variables: {
      data: {
        projectId,
        file: new Blob(),
        id: "image-id",
      },
    },
  });

  await client.mutate({
    mutation: gql`
      mutation createLabel($data: LabelCreateInput) {
        createLabel(data: $data) {
          id
        }
      }
    `,
    variables: {
      data: {
        imageId: "image-id",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [0, 0],
              [42, 0],
              [42, 36],
              [0, 36],
              [0, 0],
            ],
          ],
        },
      },
    },
  });

  await client.mutate({
    mutation: gql`
      mutation createLabelClass($data: LabelClassCreateInput) {
        createLabelClass(data: $data) {
          id
        }
      }
    `,
    variables: {
      data: {
        projectId,
        name: "my-label",
        color: "#ffffff",
      },
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

  test("Creating a project should fail if the project name already exists", async () => {
    await createProject("my project", "an-id");

    return expect(createProject("my project", "an-other-id")).rejects.toEqual(
      new Error("Could not create the project")
    );
  });

  test("Creating a project should fail if the project slug already exists", async () => {
    await createProject("my project", "an-id");

    return expect(createProject("My Project", "an-other-id")).rejects.toEqual(
      new Error("Could not create the project")
    );
  });

  test("Create project should fail if the project name is empty", () => {
    return expect(createProject("", "an-id")).rejects.toEqual(
      new Error("Could not create the project with an empty name")
    );
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
    await createProject(name, projectId);

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
    ).rejects.toEqual(new Error("No project with such id"));
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

  test("should delete a project and its content", async () => {
    mockedProbeSync.mockReturnValue({
      width: 42,
      height: 36,
      mime: "image/jpeg",
    });
    const name = "My new project";
    const projectId = "some id";
    await createProject(name, projectId);
    await updateProjectWithImageLabelAndClass(projectId);

    const mutationResult = await client.mutate({
      mutation: gql`
        mutation deleteProject($id: ID!) {
          deleteProject(where: { id: $id }) {
            id
            name
          }
        }
      `,
      variables: {
        id: projectId,
      },
    });

    expect(mutationResult.data.deleteProject.name).toEqual(name);

    const labels = await client.query({
      query: gql`
        query {
          labelsAggregates {
            totalCount
          }
        }
      `,
    });

    const labelClasses = await client.query({
      query: gql`
        query {
          labelClassesAggregates {
            totalCount
          }
        }
      `,
    });

    const images = await client.query({
      query: gql`
        query {
          imagesAggregates {
            totalCount
          }
        }
      `,
    });

    expect(labels.data.labelsAggregates.totalCount).toEqual(0);
    expect(labelClasses.data.labelClassesAggregates.totalCount).toEqual(0);
    expect(images.data.imagesAggregates.totalCount).toEqual(0);

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
          id: projectId,
        },
      })
    ).rejects.toEqual(new Error("No project with such id"));
  });

  test("should throw an error if the project to delete does not exist", () => {
    return expect(
      client.mutate({
        mutation: gql`
          mutation deleteProject($id: ID!) {
            deleteProject(where: { id: $id }) {
              id
              name
            }
          }
        `,
        variables: {
          id: "not existing project id",
        },
      })
    ).rejects.toEqual(new Error("No project with such id"));
  });

  test("Should update a project with a new name", async () => {
    const name = "My new project";
    const projectId = "some id";
    await createProject(name, projectId);

    const mutationResult = await client.mutate({
      mutation: gql`
        mutation updateProject($id: ID!, $data: ProjectUpdateInput!) {
          updateProject(where: { id: $id }, data: $data) {
            id
            name
          }
        }
      `,
      variables: {
        id: projectId,
        data: { name: "My new project new name" },
      },
    });

    expect(mutationResult.data.updateProject).toEqual(
      expect.objectContaining({
        id: projectId,
        name: "My new project new name",
      })
    );

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
        name: "My new project new name",
      })
    );
  });

  test("Should throw when updating a project with an existing name", async () => {
    const name1 = "My new project";
    const name2 = "My other project";
    const projectId1 = "id1";
    const projectId2 = "id2";
    await createProject(name1, projectId1);
    await createProject(name2, projectId2);

    const updateProjectName = () =>
      client.mutate({
        mutation: gql`
          mutation updateProject($id: ID!, $data: ProjectUpdateInput!) {
            updateProject(where: { id: $id }, data: $data) {
              id
              name
            }
          }
        `,
        variables: {
          id: projectId2,
          data: { name: name1 },
        },
      });

    return expect(updateProjectName).rejects.toEqual(
      new Error("Could not update the project")
    );
  });

  test("Should throw when updating a project with an existing slug", async () => {
    const name1 = "My New Project";
    const name2 = "My other project";
    const projectId1 = "id1";
    const projectId2 = "id2";
    await createProject(name1, projectId1);
    await createProject(name2, projectId2);

    const updateProjectName = () =>
      client.mutate({
        mutation: gql`
          mutation updateProject($id: ID!, $data: ProjectUpdateInput!) {
            updateProject(where: { id: $id }, data: $data) {
              id
              name
            }
          }
        `,
        variables: {
          id: projectId2,
          data: { name: "my new project" },
        },
      });

    return expect(updateProjectName).rejects.toEqual(
      new Error("Could not update the project")
    );
  });

  test("Should throw when trying to update a project that doesn't exist", () => {
    return expect(
      client.mutate({
        mutation: gql`
          mutation updateProject($id: ID!, $data: ProjectUpdateInput!) {
            updateProject(where: { id: $id }, data: $data) {
              id
              name
            }
          }
        `,
        variables: {
          id: "id that doesn't exists",
          data: { name: "My new project new name" },
        },
      })
    ).rejects.toEqual(new Error("No project with such id"));
  });

  test("Find project by name", async () => {
    const name = "My new project";
    const projectId = "some id";
    await createProject(name, projectId);

    const queryResult = await client.query({
      query: gql`
        query getProject($name: String!) {
          project(where: { name: $name }) {
            id
            name
          }
        }
      `,
      variables: {
        name,
      },
    });

    expect(queryResult.data.project).toEqual(
      expect.objectContaining({
        id: projectId,
        name,
      })
    );
  });

  it("should list a project images, label classes and labels", async () => {
    mockedProbeSync.mockReturnValue({
      width: 42,
      height: 36,
      mime: "image/jpeg",
    });

    const getProjectData = async (projectId: string) => {
      return client.query({
        query: gql`
          query getProjectData($id: ID!) {
            project(where: { id: $id }) {
              id
              images {
                id
              }
              labels {
                id
              }
              labelClasses {
                id
              }
            }
          }
        `,
        variables: {
          id: projectId,
        },
        fetchPolicy: "network-only",
      });
    };

    const expectedResults = (queryResult: any, count: number) => {
      expect(queryResult.data.project.images.length).toEqual(count);
      expect(queryResult.data.project.labels.length).toEqual(count);
      expect(queryResult.data.project.labelClasses.length).toEqual(count);
    };

    const projectId = "some id";
    const otherId = "some other id";

    createProject("My new project", projectId);
    createProject("My other project", otherId);

    const initialCountQuery = await getProjectData(projectId);
    const otherInitialCountQuery = await getProjectData(otherId);

    expectedResults(initialCountQuery, 0);
    expectedResults(otherInitialCountQuery, 0);

    await updateProjectWithImageLabelAndClass(projectId);

    const updateCountQuery = await getProjectData(projectId);
    const otherUpdateCountQuery = await getProjectData(otherId);

    expectedResults(updateCountQuery, 1);
    expectedResults(otherUpdateCountQuery, 0);
  });

  it("should count a project images, label classes and labels", async () => {
    mockedProbeSync.mockReturnValue({
      width: 42,
      height: 36,
      mime: "image/jpeg",
    });

    const getProjectCount = async (projectId: string) => {
      return client.query({
        query: gql`
          query getProjectCounts($id: ID!) {
            project(where: { id: $id }) {
              id
              imagesAggregates {
                totalCount
              }
              labelsAggregates {
                totalCount
              }
              labelClassesAggregates {
                totalCount
              }
            }
          }
        `,
        variables: {
          id: projectId,
        },
        fetchPolicy: "network-only",
      });
    };

    const expectedResults = (queryResult: any, count: number) => {
      expect(queryResult.data.project.imagesAggregates.totalCount).toEqual(
        count
      );
      expect(queryResult.data.project.labelsAggregates.totalCount).toEqual(
        count
      );
      expect(
        queryResult.data.project.labelClassesAggregates.totalCount
      ).toEqual(count);
    };

    const projectId = "some id";
    const otherId = "some other id";

    createProject("My new project", projectId);
    createProject("My other project", otherId);

    const initialCountQuery = await getProjectCount(projectId);
    const otherInitialCountQuery = await getProjectCount(otherId);

    expectedResults(initialCountQuery, 0);
    expectedResults(otherInitialCountQuery, 0);

    await updateProjectWithImageLabelAndClass(projectId);

    const updateCountQuery = await getProjectCount(projectId);
    const otherUpdateCountQuery = await getProjectCount(otherId);

    expectedResults(updateCountQuery, 1);
    expectedResults(otherUpdateCountQuery, 0);
  });

  test("Find project by name shortly after renaming it (bug that we noticed)", async () => {
    const name = "My old project";
    const newName = "My new project";
    const projectId = "some id";
    await createProject(name, projectId);

    const queryResult1 = await client.query({
      query: gql`
        query getProject($name: String!) {
          project(where: { name: $name }) {
            id
            name
          }
        }
      `,
      variables: {
        name,
      },
      fetchPolicy: "no-cache",
    });

    expect(queryResult1.data.project).toEqual(
      expect.objectContaining({
        id: projectId,
        name,
      })
    );

    await client.mutate({
      mutation: gql`
        mutation updateProject($id: ID, $name: String!) {
          updateProject(where: { id: $id }, data: { name: $name }) {
            id
            name
          }
        }
      `,
      variables: {
        id: projectId,
        name: newName,
      },
      fetchPolicy: "no-cache",
    });

    const queryResult2 = await client.query({
      query: gql`
        query getProject($name: String!) {
          project(where: { name: $name }) {
            id
            name
          }
        }
      `,
      variables: {
        name: newName,
      },
      fetchPolicy: "no-cache",
    });

    expect(queryResult2.data.project).toEqual(
      expect.objectContaining({
        id: projectId,
        name: newName,
      })
    );
  });
});
