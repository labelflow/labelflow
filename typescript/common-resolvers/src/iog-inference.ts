import { v4 as uuidv4 } from "uuid";
import {
  LabelType,
  RunIogInput,
  MutationCreateIogLabelArgs,
  MutationUpdateIogLabelArgs,
} from "@labelflow/graphql-types";
import "isomorphic-fetch";

import { Context } from "./types";

import { throwIfResolvesToNil } from "./utils/throw-if-resolves-to-nil";

const downloadUrlToDataUrl = async (url: string, req: Request | undefined) => {
  const headers = new Headers();
  headers.set("Accept", "image/tiff,image/jpeg,image/png,image/*,*/*;q=0.8");
  headers.set("Sec-Fetch-Dest", "image");
  if ((req?.headers as any)?.cookie) {
    headers.set("Cookie", (req?.headers as any)?.cookie);
  }
  const fetchResult = await fetch(url, {
    method: "GET",
    headers,
    credentials: "include",
  });
  if (fetchResult.status !== 200) {
    throw new Error(
      `[IOG revolver] -- Getting image from storage, could not fetch image at url ${url} properly, code ${fetchResult.status}`
    );
  }
  try {
    // Try executing as if we were in local service worker
    const reader = new FileReader(); // Fails here on NodeJs
    // It's important that it fails before fetchResult.blob() on NodeJs, which avoids a bug
    const blob = await fetchResult.blob();
    return await new Promise<string>((resolve) => {
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    // We're on NodeJs (remote server)
    const arrayBuffer = await fetchResult.arrayBuffer();
    return `data:application/json;base64,${Buffer.from(arrayBuffer).toString(
      "base64"
    )}`;
  }
};

const fetchIogServer = async (
  variables: RunIogInput
): Promise<{
  geometry: { type: string; coordinates: number[][][] };
  x: number;
  y: number;
  height: number;
  width: number;
}> => {
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
      variables,
    }),
  }).then((res) => {
    if (res.status !== 200) {
      throw new Error(
        `Error fetching IOG results, status ${res.status} ${res.statusText}`
      );
    }
    return res.json().then((parsedResponse) => parsedResponse.data.runIog);
  });
  // Uncomment bellow for dummy IOG (test purpose)
  // Start dummy iog
  // await new Promise((resolve) => {
  //   setTimeout(resolve, 2000);
  // });
  // const label = await repository.label.get({ id: labelId });
  // const filledInputs = {
  //   ...label.smartToolInput,
  //   ...variables,
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
  const geometry = {
    type: "Polygon",
    coordinates: result?.polygons as number[][][],
  };
  const [x, y, X, Y] = geometry.coordinates.reduce(
    ([xCurrent, yCurrent, XCurrent, YCurrent], polygon: number[][]) => {
      const [xPolygon, yPolygon, XPolygon, YPolygon] = polygon.reduce(
        (
          [xPolygonCurrent, yPolygonCurrent, XPolygonCurrent, YPolygonCurrent],
          point
        ) => [
          Math.min(xPolygonCurrent, point[0]),
          Math.min(yPolygonCurrent, point[1]),
          Math.max(XPolygonCurrent, point[0]),
          Math.max(YPolygonCurrent, point[1]),
        ],
        [Infinity, Infinity, 0, 0]
      );
      return [
        Math.min(xPolygon, xCurrent),
        Math.min(yPolygon, yCurrent),
        Math.max(XPolygon, XCurrent),
        Math.max(YPolygon, YCurrent),
      ];
    },
    [Infinity, Infinity, 0, 0]
  );
  return {
    geometry,
    x,
    y,
    width: X - x,
    height: Y - y,
  };
};

const createIogLabel = async (
  _parent: any,
  args: MutationCreateIogLabelArgs,
  { repository, user, req }: Context
) => {
  const labelId = args?.data?.id ?? uuidv4();
  // Since we don't have any constraint checks with Dexie
  // We need to ensure that the imageId and the labelClassId
  // matches some entity before being able to continue.
  const image = await throwIfResolvesToNil(
    `The image id ${args.data.imageId} doesn't exist.`,
    repository.image.get
  )({ id: args.data.imageId }, user);
  const dataUrl = await downloadUrlToDataUrl(image.url, req);
  const now = new Date();

  const xInit = Math.min(image.width, Math.max(0, args.data.x));
  const yInit = Math.min(image.height, Math.max(0, args.data.y));
  const { geometry, x, y, height, width } = await fetchIogServer({
    id: labelId,
    imageUrl: dataUrl,
    x: xInit,
    y: yInit,
    width: Math.min(image.width, Math.max(0, xInit + args.data.width)) - xInit,
    height:
      Math.min(image.height, Math.max(0, yInit + args.data.height)) - yInit,
    centerPoint: args.data.centerPoint,
  });
  const newLabelEntity = {
    id: labelId,
    type: LabelType.Polygon,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    labelClassId: null,
    imageId: args.data.imageId,
    geometry,
    x,
    y,
    height,
    width,
    smartToolInput: args.data,
  };
  await repository.label.add(newLabelEntity, user);
  return await throwIfResolvesToNil(
    "No label with such id",
    repository.label.get
  )({ id: labelId }, user);
};

const updateIogLabel = async (
  _parent: any,
  args: MutationUpdateIogLabelArgs,
  { repository, user }: Context
) => {
  const { geometry, x, y, height, width } = await fetchIogServer(args.data);
  const now = new Date();
  const { smartToolInput } = await throwIfResolvesToNil(
    "No label with such id",
    repository.label.get
  )({ id: args.data.id }, user);
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
  return await throwIfResolvesToNil(
    "No label with such id",
    repository.label.get
  )({ id: args.data.id }, user);
};

export default {
  Mutation: {
    createIogLabel,
    updateIogLabel,
  },
};
