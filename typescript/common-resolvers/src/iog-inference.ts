import { MutationRunIogArgs } from "@labelflow/graphql-types";

import { Context } from "./types";

import { throwIfResolvesToNil } from "./utils/throw-if-resolves-to-nil";

const runIog = async (
  _parent: any,
  args: MutationRunIogArgs,
  { repository, user }: Context
) => {
  const result = await fetch(process.env.NEXT_PUBLIC_IOG_API_ENDPOINT ?? "", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      operationName: "runIog",
      query: `
      mutation runIog(
        $id: ID!
        $imageUrl: String
        $x: Float
        $y: Float
        $width: Float
        $height: Float
        $pointsInside: [[Float!]]
        $pointsOutside: [[Float!]]
        $centerPoint: [Float!]
      ) {
        runIog(
          data: {
            id: $id
            imageUrl: $imageUrl
            x: $x
            y: $y
            width: $width
            height: $height
            pointsInside: $pointsInside
            pointsOutside: $pointsOutside
            centerPoint: $centerPoint
          }
        ) {
          polygons
        }
      }
      `,
      variables: args.data,
    }),
  }).then((res) =>
    res.json().then((parsedResponse) => parsedResponse.data.runIog)
  );
  // Uncomment bellow for dummy IOG (test purpose)
  // Start dummy iog
  // await new Promise((resolve) => {
  //   setTimeout(resolve, 2000);
  // });
  // const label = await repository.label.get({ id: args.data.id });
  // const filledInputs = {
  //   ...label.smartToolInput,
  //   ...args.data,
  // };
  // const [x, y, X, Y] = [
  //   filledInputs?.x + filledInputs?.width / 4,
  //   filledInputs?.y + filledInputs?.height / 4,
  //   filledInputs?.x + (3 * filledInputs?.width) / 4,
  //   filledInputs?.y + (3 * filledInputs?.height) / 4,
  // ];
  // const result = {
  //   polygons: [
  //     [
  //       [x, y],
  //       [X, y],
  //       [X, Y],
  //       [x, Y],
  //       [x, y],
  //     ],
  //   ],
  // };
  // End dummy iog
  if (result) {
    const geometry = {
      type: "Polygon",
      coordinates: result?.polygons,
    };
    const { smartToolInput } = await throwIfResolvesToNil(
      "No label with such id",
      repository.label.get
    )({ id: args.data.id }, user);

    const xCoordinates = geometry.coordinates.reduce(
      (xCoordinatesCurrent: number[], polygon: number[][]) => [
        ...xCoordinatesCurrent,
        ...polygon.map((point: number[]) => point[0]),
      ],
      []
    );
    const yCoordinates = geometry.coordinates.reduce(
      (yCoordinatesCurrent: number[], polygon: number[][]) => [
        ...yCoordinatesCurrent,
        ...polygon.map((point: number[]) => point[1]),
      ],
      []
    );
    const [x, y, X, Y] = [
      Math.min(...xCoordinates),
      Math.min(...yCoordinates),
      Math.max(...xCoordinates),
      Math.max(...yCoordinates),
    ];
    const width = X - x;
    const height = Y - y;

    const now = new Date();

    const newLabelEntity = {
      smartToolInput: { ...smartToolInput, ...args.data },
      updatedAt: now.toISOString(),
      geometry,
      x,
      y,
      height,
      width,
    };
    await repository.label.update({ id: args.data.id }, newLabelEntity, user);
  }
  return await throwIfResolvesToNil(
    "No label with such id",
    repository.label.get
  )({ id: args.data.id }, user);
};

export default {
  Mutation: {
    runIog,
  },
};
