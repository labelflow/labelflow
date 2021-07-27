import { incrementMockedDate } from "@labelflow/dev-utils/mockdate";
import { gql } from "@apollo/client";
// eslint-disable-next-line import/no-extraneous-dependencies
import { mocked } from "ts-jest/utils";
import probe from "probe-image-size";

import { client } from "../../apollo-client-schema";
import { setupTestsWithLocalDatabase } from "../../../utils/setup-local-db-tests";
import { LabelCreateInput, LabelType } from "@labelflow/graphql-types";

setupTestsWithLocalDatabase();

jest.mock("probe-image-size");
const mockedProbeSync = mocked(probe.sync);

const getGeometryFromExtent = ({
  x,
  y,
  width,
  height,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
}): { type: string; coordinates: number[][][] } => ({
  type: "Polygon",
  coordinates: [
    [
      [x, y],
      [x + width, y],
      [x + width, y + height],
      [x, y + height],
      [x, y],
    ],
  ],
});
const labelDataExtent = {
  x: 3.14,
  y: 42,
  type: LabelType.Box,
  height: 768,
  width: 362,
};

const labelData = {
  geometry: getGeometryFromExtent(labelDataExtent),
};

const imageWidth = 500;
const imageHeight = 900;

const testProjectId = "test project id";

const createProject = async (
  name: string,
  projectId: string = testProjectId
) => {
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

const createLabel = (data: LabelCreateInput) => {
  return client.mutate({
    mutation: gql`
      mutation createLabel($data: LabelCreateInput!) {
        createLabel(data: $data) {
          id
        }
      }
    `,
    variables: {
      data,
    },
  });
};

const createImage = async (name: String) => {
  mockedProbeSync.mockReturnValue({
    width: 42,
    height: 36,
    mime: "image/jpeg",
    length: 1000,
    hUnits: "px",
    wUnits: "px",
    url: "https://example.com/image.jpeg",
    type: "jpg",
  });
  const mutationResult = await client.mutate({
    mutation: gql`
      mutation createImage(
        $projectId: ID!
        $file: Upload!
        $name: String!
        $width: Int
        $height: Int
      ) {
        createImage(
          data: {
            projectId: $projectId
            name: $name
            file: $file
            width: $width
            height: $height
          }
        ) {
          id
        }
      }
    `,
    variables: {
      projectId: testProjectId,
      file: new Blob(),
      name,
      width: imageWidth,
      height: imageHeight,
    },
  });

  const {
    data: {
      createImage: { id },
    },
  } = mutationResult;

  return id;
};

const createLabelClass = async (name: String) => {
  const {
    data: {
      createLabelClass: { id },
    },
  } = await client.mutate({
    mutation: gql`
      mutation createLabelClass($projectId: ID!, $name: String!) {
        createLabelClass(
          data: { projectId: $projectId, name: $name, color: "#ffffff" }
        ) {
          id
          name
          color
        }
      }
    `,
    variables: {
      projectId: testProjectId,
      name,
    },
  });

  return id;
};

beforeEach(async () => {
  // Images and label classes are always liked to a project
  await createProject("Test project");
});

describe("Label resolver test suite", () => {
  test("Creating a label should fail if its image doesn't exist", async () => {
    const imageId = "0024fbc1-387b-444f-8ad0-d7a3e316726a";
    return expect(
      createLabel({
        ...labelData,
        imageId,
      })
    ).rejects.toThrow(`The image id ${imageId} doesn't exist.`);
  });

  test("Creating a label should fail if its labelClassId doesn't exist", async () => {
    const imageId = await createImage("an image");
    const labelClassId = "0024fbc1-387b-444f-8ad0-d7a3e316726a";
    return expect(
      createLabel({
        ...labelData,
        imageId,
        labelClassId,
      })
    ).rejects.toThrow(`The labelClass id ${labelClassId} doesn't exist.`);
  });

  test("Create label and compute its bounding box", async () => {
    const imageId = await createImage("an image");
    const bbox = {
      x: 0,
      y: 0,
      width: 1,
      height: 1,
    };
    const geometry = getGeometryFromExtent(bbox);

    const createResult = await createLabel({
      geometry,
      imageId,
    });

    const queryResult = await client.query({
      query: gql`
        query getImage($id: ID!) {
          image(where: { id: $id }) {
            labels {
              id
              x
              y
              width
              height
              labelClass
            }
          }
        }
      `,
      variables: {
        id: imageId,
      },
    });

    expect(queryResult.data.image.labels[0].id).toEqual(
      createResult.data.createLabel.id
    );
    expect(queryResult.data.image.labels[0]).toEqual(
      expect.objectContaining(bbox)
    );
  });

  test("Create label without labelClass", async () => {
    const imageId = await createImage("an image");

    await createLabel({
      ...labelData,
      imageId,
    });

    const queryResult = await client.query({
      query: gql`
        query getImage($id: ID!) {
          image(where: { id: $id }) {
            labels {
              id
              labelClass
            }
          }
        }
      `,
      variables: {
        id: imageId,
      },
    });

    expect(queryResult.data.image.labels[0].labelClass).toBeNull();
  });

  test("Create label with labelClass", async () => {
    const imageId = await createImage("an image");

    const aClassName = "a class";
    const labelClassId = await createLabelClass("a class");

    await createLabel({
      ...labelData,
      imageId,
      labelClassId,
    });

    const queryResult = await client.query({
      query: gql`
        query getImage($id: ID!) {
          image(where: { id: $id }) {
            labels {
              id
              labelClass {
                name
              }
            }
          }
        }
      `,
      variables: {
        id: imageId,
      },
    });

    expect(queryResult.data.image.labels[0].labelClass.name).toEqual(
      aClassName
    );
  });

  test("Create label with an id", async () => {
    const labelId = "some randomn id";

    const imageId = await createImage("an image");
    const createResult = await createLabel({
      ...labelData,
      id: labelId,
      imageId,
    });

    expect(createResult.data.createLabel.id).toEqual(labelId);
  });

  test("Create several labels", async () => {
    const imageId = await createImage("an image");

    await createLabel({
      ...labelData,
      id: "1",
      imageId,
    });
    incrementMockedDate(1);
    await createLabel({
      ...labelData,
      id: "2",
      imageId,
    });

    const queryResult = await client.query({
      query: gql`
        query getImage($id: ID!) {
          image(where: { id: $id }) {
            labels {
              id
            }
          }
        }
      `,
      variables: {
        id: imageId,
      },
    });

    expect(
      queryResult.data.image.labels.map((label: { id: string }) => label.id)
    ).toEqual(["1", "2"]);
  });

  test("Querying a label with its labelClass", async () => {
    const imageId = await createImage("an image");
    const labelClassId = await createLabelClass("a class");

    await createLabel({
      ...labelData,
      imageId,
      labelClassId,
    });

    const queryResult = await client.query({
      query: gql`
        query getImage($id: ID!) {
          image(where: { id: $id }) {
            id
            labels {
              x
              labelClass {
                id
              }
            }
          }
        }
      `,
      variables: {
        id: imageId,
      },
    });

    // labels should show in the right order
    expect(queryResult.data.image.labels[0].labelClass.id).toEqual(
      labelClassId
    );
  });

  test("should delete a label", async () => {
    const imageId = await createImage("an image");
    const createResult = await createLabel({
      ...labelData,
      imageId,
    });
    const labelId = createResult.data.createLabel.id;

    client.mutate({
      mutation: gql`
        mutation deleteLabel($id: ID!) {
          deleteLabel(where: { id: $id }) {
            id
          }
        }
      `,
      variables: {
        id: labelId,
      },
    });

    const queryResult = await client.query({
      query: gql`
        query getImage($id: ID!) {
          image(where: { id: $id }) {
            labels {
              id
            }
          }
        }
      `,
      variables: {
        id: imageId,
      },
    });

    expect(queryResult.data.image.labels).toHaveLength(0);
  });

  test("should throw when the label to delete doesn't exist", () => {
    return expect(
      client.mutate({
        mutation: gql`
          mutation deleteLabel($id: ID!) {
            deleteLabel(where: { id: $id }) {
              id
            }
          }
        `,
        variables: {
          id: "id-of-a-label-that-doesnt-exist",
        },
      })
    ).rejects.toThrow("No label with such id");
  });

  test("should update a label", async () => {
    const imageId = await createImage("an image");
    const createResult = await createLabel({
      ...labelData,
      imageId,
    });
    const labelId = createResult.data.createLabel.id;
    const bbox = {
      x: 0,
      y: 0,
      width: 1,
      height: 1,
    };
    const newGeometry = getGeometryFromExtent(bbox);

    await client.mutate({
      mutation: gql`
        mutation updateLabel($id: ID!, $data: LabelUpdateInput!) {
          updateLabel(where: { id: $id }, data: $data) {
            id
          }
        }
      `,
      variables: {
        id: labelId,
        data: {
          geometry: newGeometry,
        },
      },
    });

    const queryResult = await client.query({
      query: gql`
        query getImage($id: ID!) {
          image(where: { id: $id }) {
            labels {
              id
              geometry {
                type
                coordinates
              }
              x
              y
              width
              height
            }
          }
        }
      `,
      variables: {
        id: imageId,
      },
    });

    expect(queryResult.data.image.labels[0].geometry).toEqual(
      expect.objectContaining(newGeometry)
    );
    expect(queryResult.data.image.labels[0]).toEqual(
      expect.objectContaining(bbox)
    );
  });

  test("should throw when the label to updated doesn't exist", () => {
    return expect(
      client.mutate({
        mutation: gql`
          mutation updateLabel($id: ID!, $data: LabelUpdateInput!) {
            updateLabel(where: { id: $id }, data: $data) {
              id
            }
          }
        `,
        variables: {
          id: "id-of-a-label-that-doesnt-exist",
          data: labelData,
        },
      })
    ).rejects.toThrow("No label with such id");
  });

  test("should throw when the label is updated with a non-existing labelClass id", async () => {
    const imageId = await createImage("an image");
    const createResult = await createLabel({
      ...labelData,
      imageId,
    });
    const labelId = createResult.data.createLabel.id;

    return expect(
      client.mutate({
        mutation: gql`
          mutation updateLabel($id: ID!, $data: LabelUpdateInput!) {
            updateLabel(where: { id: $id }, data: $data) {
              id
            }
          }
        `,
        variables: {
          id: labelId,
          data: { labelClassId: "id-of-a-label-class-that-doesnt-exist" },
        },
      })
    ).rejects.toThrow("No label class with such id");
  });

  test("Query label when id doesn't exists", async () => {
    return expect(
      client.query({
        query: gql`
          query getlabel($id: ID!) {
            label(where: { id: $id }) {
              id
            }
          }
        `,
        variables: {
          id: "some-id",
        },
      })
    ).rejects.toThrow("No label with such id");
  });

  test("Query a specific label from ID should return the label", async () => {
    const labelId = "my-label-id";

    const imageId = await createImage("an-image");
    await createLabel({
      ...labelData,
      id: labelId,
      imageId,
    });

    const queryResult = await client.query({
      query: gql`
        query getLabel($id: ID!) {
          label(where: { id: $id }) {
            id
            x
            y
            width
            height
            geometry {
              type
              coordinates
            }
          }
        }
      `,
      variables: {
        id: labelId,
      },
    });

    expect(queryResult.data.label).toEqual(
      expect.objectContaining({
        ...labelData,
        geometry: expect.objectContaining({ ...labelData.geometry }),
        id: labelId,
      })
    );
  });

  test("Create label should fail if called with bounding box out of image bounds", async () => {
    const imageId = await createImage("an image");

    // x out of bounds
    await expect(
      createLabel({
        imageId,
        geometry: getGeometryFromExtent({
          x: -300,
          width: 50,
          y: 10,
          height: 20,
        }),
      })
    ).rejects.toThrow("Label out of image bounds");
    await expect(
      createLabel({
        imageId,
        geometry: getGeometryFromExtent({
          x: imageWidth + 10,
          width: 50,
          y: 10,
          height: 20,
        }),
      })
    ).rejects.toThrow("Label out of image bounds");
    // y out of bounds
    await expect(
      createLabel({
        imageId,
        geometry: getGeometryFromExtent({
          x: 10,
          width: 10,
          y: -100,
          height: 10,
        }),
      })
    ).rejects.toThrow("Label out of image bounds");
    await expect(
      createLabel({
        imageId,
        geometry: getGeometryFromExtent({
          x: 10,
          width: 10,
          y: imageHeight + 10,
          height: 20,
        }),
      })
    ).rejects.toThrow("Label out of image bounds");
  });

  test("It should resize bounding box to image size when it is bigger", async () => {
    const labelId = "my-label-id";

    const imageId = await createImage("an-image");
    await createLabel({
      id: labelId,
      imageId,
      geometry: getGeometryFromExtent({
        x: -10,
        width: imageWidth + 10 + 10,
        y: -10,
        height: imageHeight + 10 + 10,
      }),
    });

    const queryResult = await client.query({
      query: gql`
        query getLabel($id: ID!) {
          label(where: { id: $id }) {
            id
            x
            y
            width
            height
          }
        }
      `,
      variables: {
        id: labelId,
      },
    });

    const { x, y, width, height } = queryResult.data.label;
    expect(x).toEqual(0);
    expect(y).toEqual(0);
    expect(width).toEqual(imageWidth);
    expect(height).toEqual(imageHeight);
  });
});

describe("LabelsAggregates resolver test suite", () => {
  test("totalCount should be 0 before image creation", async () => {
    const queryResult = await client.query({
      query: gql`
        query getLabelsCount {
          labelsAggregates {
            totalCount
          }
        }
      `,
    });

    expect(queryResult.data.labelsAggregates.totalCount).toEqual(0);
  });

  test("totalCount should be 1 after creation of one label", async () => {
    const imageId = await createImage("an image");

    await createLabel({
      ...labelData,
      imageId,
    });

    const queryResult = await client.query({
      query: gql`
        query getLabelsCount {
          labelsAggregates {
            totalCount
          }
        }
      `,
    });

    expect(queryResult.data.labelsAggregates.totalCount).toEqual(1);
  });

  test("totalCount should be 2 after creation of two labels", async () => {
    const imageId = await createImage("an image");

    await createLabel({
      ...labelData,
      imageId,
    });
    incrementMockedDate(1);
    await createLabel({
      ...labelData,
      imageId,
    });

    const queryResult = await client.query({
      query: gql`
        query getLabelsCount {
          labelsAggregates {
            totalCount
          }
        }
      `,
    });

    expect(queryResult.data.labelsAggregates.totalCount).toEqual(2);
  });
});

test("Create label should fail if called with bounding box out of image bounds", async () => {
  const imageId = await createImage("an image");

  // x out of bounds
  await expect(
    createLabel({
      imageId,
      geometry: getGeometryFromExtent({
        x: -300,
        width: 50,
        y: 10,
        height: 20,
      }),
    })
  ).rejects.toThrow("Label out of image bounds");
  await expect(
    createLabel({
      imageId,
      geometry: getGeometryFromExtent({
        x: imageWidth + 10,
        width: 50,
        y: 10,
        height: 20,
      }),
    })
  ).rejects.toThrow("Label out of image bounds");
  // y out of bounds
  await expect(
    createLabel({
      imageId,
      geometry: getGeometryFromExtent({
        x: 10,
        width: 10,
        y: -100,
        height: 10,
      }),
    })
  ).rejects.toThrow("Label out of image bounds");
  await expect(
    createLabel({
      imageId,
      geometry: getGeometryFromExtent({
        x: 10,
        width: 10,
        y: imageHeight + 10,
        height: 20,
      }),
    })
  ).rejects.toThrow("Label out of image bounds");
});

test("It should resize bounding box to image size when it is bigger", async () => {
  const labelId = "my-label-id";

  const imageId = await createImage("an-image");
  await createLabel({
    id: labelId,
    imageId,
    geometry: getGeometryFromExtent({
      x: -10,
      width: imageWidth + 10 + 10,
      y: -10,
      height: imageHeight + 10 + 10,
    }),
  });

  const queryResult = await client.query({
    query: gql`
      query getLabel($id: ID!) {
        label(where: { id: $id }) {
          id
          x
          y
          width
          height
        }
      }
    `,
    variables: {
      id: labelId,
    },
  });

  const { x, y, width, height } = queryResult.data.label;
  expect(x).toEqual(0);
  expect(y).toEqual(0);
  expect(width).toEqual(imageWidth);
  expect(height).toEqual(imageHeight);
});

test("should update a label resizing it to fit in image", async () => {
  const imageId = await createImage("an image");
  const createResult = await createLabel({
    ...labelData,
    imageId,
  });
  const labelId = createResult.data.createLabel.id;

  await client.mutate({
    mutation: gql`
      mutation updateLabel($id: ID!, $data: LabelUpdateInput!) {
        updateLabel(where: { id: $id }, data: $data) {
          id
        }
      }
    `,
    variables: {
      id: labelId,
      data: {
        geometry: getGeometryFromExtent({
          x: -10,
          width: imageWidth + 20,
          y: -10,
          height: imageHeight + 10,
        }),
      },
    },
  });

  const queryResult = await client.query({
    query: gql`
      query getImage($id: ID!) {
        image(where: { id: $id }) {
          labels {
            id
            x
            y
            width
            height
          }
        }
      }
    `,
    variables: {
      id: imageId,
    },
  });

  expect(queryResult.data.image.labels[0].x).toEqual(0);
  expect(queryResult.data.image.labels[0].y).toEqual(0);
  expect(queryResult.data.image.labels[0].width).toEqual(imageWidth);
  expect(queryResult.data.image.labels[0].height).toEqual(imageHeight);
});

test("should throw when updating a label that will be outside of image bounds", async () => {
  const imageId = await createImage("an image");
  const createResult = await createLabel({
    ...labelData,
    imageId,
  });
  const labelId = createResult.data.createLabel.id;

  await expect(
    client.mutate({
      mutation: gql`
        mutation updateLabel($id: ID!, $data: LabelUpdateInput!) {
          updateLabel(where: { id: $id }, data: $data) {
            id
          }
        }
      `,
      variables: {
        id: labelId,
        data: {
          geometry: getGeometryFromExtent({
            x: -100,
            width: 20,
            y: -10,
            height: imageHeight + 10,
          }),
        },
      },
    })
  ).rejects.toThrow("Label out of image bounds");
  await expect(
    client.mutate({
      mutation: gql`
        mutation updateLabel($id: ID!, $data: LabelUpdateInput!) {
          updateLabel(where: { id: $id }, data: $data) {
            id
          }
        }
      `,
      variables: {
        id: labelId,
        data: {
          geometry: getGeometryFromExtent({
            x: 0,
            width: 20,
            y: -100,
            height: 10,
          }),
        },
      },
    })
  ).rejects.toThrow("Label out of image bounds");
  await expect(
    client.mutate({
      mutation: gql`
        mutation updateLabel($id: ID!, $data: LabelUpdateInput!) {
          updateLabel(where: { id: $id }, data: $data) {
            id
          }
        }
      `,
      variables: {
        id: labelId,
        data: {
          geometry: getGeometryFromExtent({
            x: imageWidth + 10,
            width: imageWidth + 20,
            y: 0,
            height: 10,
          }),
        },
      },
    })
  ).rejects.toThrow("Label out of image bounds");
  await expect(
    client.mutate({
      mutation: gql`
        mutation updateLabel($id: ID!, $data: LabelUpdateInput!) {
          updateLabel(where: { id: $id }, data: $data) {
            id
          }
        }
      `,
      variables: {
        id: labelId,
        data: {
          geometry: getGeometryFromExtent({
            x: 0,
            width: 20,
            y: imageHeight + 10,
            height: imageHeight + 20,
          }),
        },
      },
    })
  ).rejects.toThrow("Label out of image bounds");
});

test("should not change label size when only updating the label class", async () => {
  const imageId = await createImage("an image");
  const createResult = await createLabel({
    ...labelData,
    imageId,
  });
  const labelId = createResult.data.createLabel.id;
  const labelClassId = await createLabelClass("a class");

  await client.mutate({
    mutation: gql`
      mutation updateLabel($id: ID!, $data: LabelUpdateInput!) {
        updateLabel(where: { id: $id }, data: $data) {
          id
        }
      }
    `,
    variables: {
      id: labelId,
      data: {
        labelClassId,
      },
    },
  });

  const queryResult = await client.query({
    query: gql`
      query getImage($id: ID!) {
        image(where: { id: $id }) {
          labels {
            id
            geometry {
              type
              coordinates
            }
            labelClass {
              id
            }
          }
        }
      }
    `,
    variables: {
      id: imageId,
    },
  });

  expect(queryResult.data.image.labels[0].geometry).toEqual(
    expect.objectContaining(labelData.geometry)
  );
  expect(queryResult.data.image.labels[0].labelClass.id).toEqual(labelClassId);
});
