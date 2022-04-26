import { v4 as uuidv4 } from "uuid";
import {
  LabelType,
  RunIogInput,
  MutationCreateIogLabelArgs,
  MutationUpdateIogLabelArgs,
  UpdateIogInput,
} from "@labelflow/graphql-types";
import "isomorphic-fetch";

import { isEmpty } from "lodash/fp";
import { Context, Repository } from "./types";

import { throwIfResolvesToNil } from "./utils/throw-if-resolves-to-nil";

export const downloadUrlToDataUrl = async (
  url: string,
  repository: Repository,
  req: undefined | Request
) => {
  const arrayBuffer = await repository.upload.get(url, req);
  // We're on NodeJs (remote server)
  return `data:application/json;base64,${Buffer.from(arrayBuffer).toString(
    "base64"
  )}`;
};

export const fetchIogServer = async (
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
  const coordinates = result?.polygons as number[][][];
  if (isEmpty(coordinates)) {
    throw new Error("Auto-Polygon returned an empty array");
  }
  const geometry = { type: "Polygon", coordinates };
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
  return { geometry, x, y, width: X - x, height: Y - y };
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
  const base64Image = await downloadUrlToDataUrl(image.url, repository, req);
  const now = new Date();

  const xInit = Math.min(image.width, Math.max(0, args.data.x));
  const yInit = Math.min(image.height, Math.max(0, args.data.y));
  const smartToolInput: Omit<RunIogInput, "imageUrl"> = {
    id: labelId,
    x: xInit,
    y: yInit,
    width: Math.min(image.width, Math.max(0, xInit + args.data.width)) - xInit,
    height:
      Math.min(image.height, Math.max(0, yInit + args.data.height)) - yInit,
    centerPoint: args.data.centerPoint,
  };
  const iogInput: RunIogInput = { ...smartToolInput, imageUrl: base64Image };
  const { geometry, x, y, height, width } = await fetchIogServer(iogInput);
  const newLabelEntity = {
    id: labelId,
    type: LabelType.Polygon,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    labelClassId: args?.data?.labelClassId ?? null,
    imageId: args.data.imageId,
    geometry,
    x,
    y,
    height,
    width,
    smartToolInput,
  };
  await repository.label.add(newLabelEntity, user);
  return await throwIfResolvesToNil(
    "No label with such id",
    repository.label.get
  )({ id: labelId }, user);
};

const updateIogLabel = async (
  _parent: any,
  { data }: MutationUpdateIogLabelArgs,
  { repository, user, req }: Context
) => {
  const { smartToolInput: oldSmartToolInput, imageId } =
    await throwIfResolvesToNil("No label with such id", repository.label.get)(
      { id: data.id },
      user
    );
  const { url } = await throwIfResolvesToNil(
    `No image with id ${imageId}`,
    repository.image.get
  )({ id: imageId }, user);
  const base64Image = await downloadUrlToDataUrl(url, repository, req);
  const smartToolInput = { ...oldSmartToolInput, ...data };
  const iogInput: UpdateIogInput = { ...smartToolInput, imageUrl: base64Image };
  const { geometry, x, y, height, width } = await fetchIogServer(iogInput);
  const now = new Date();
  const newLabelEntity = {
    smartToolInput,
    updatedAt: now.toISOString(),
    geometry,
    x,
    y,
    height,
    width,
  };
  await repository.label.update({ id: data.id }, newLabelEntity, user);
  return await throwIfResolvesToNil(
    "No label with such id",
    repository.label.get
  )({ id: data.id }, user);
};

export default {
  Mutation: {
    createIogLabel,
    updateIogLabel,
  },
};
