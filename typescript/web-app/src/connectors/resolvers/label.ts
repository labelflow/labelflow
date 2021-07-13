import { v4 as uuidv4 } from "uuid";
import bboxPolygon from "@turf/bbox-polygon";
import { polygon } from "@turf/helpers";
import intersect from "@turf/intersect";
import bbox from "@turf/bbox";

import type {
  GeometryInput,
  Label,
  MutationCreateLabelArgs,
  MutationDeleteLabelArgs,
  MutationUpdateLabelArgs,
  QueryLabelArgs,
} from "../../graphql-types.generated";
import { db, DbLabel } from "../database";

export const getLabels = () => db.label.toArray();

const getLabelById = async (id: string): Promise<DbLabel> => {
  const entity = await db.label.get(id);
  if (entity === undefined) {
    throw new Error("No label with such id");
  }

  return entity;
};

// Queries
const labelClass = async (label: DbLabel) => {
  if (!label?.labelClassId) {
    return null;
  }

  return db.labelClass.get(label.labelClassId) ?? null;
};

const label = (_: any, args: QueryLabelArgs) => {
  return getLabelById(args?.where?.id);
};

const getBoundedGeometryFromImage = (
  imageDimensions: { width: number; height: number },
  geometry: GeometryInput
) => {
  const geometryPolygon = polygon(geometry.coordinates);
  const imagePolygon = bboxPolygon([
    0,
    0,
    imageDimensions.width,
    imageDimensions.height,
  ]);
  const clippedGeometryObject = intersect(imagePolygon, geometryPolygon);

  if (clippedGeometryObject?.geometry == null) {
    throw new Error("Bounding box out of image bounds");
  }

  const [minX, minY, maxX, maxY] = bbox(clippedGeometryObject.geometry);
  const width = maxX - minX;
  const height = maxY - minY;

  return {
    geometry: clippedGeometryObject.geometry,
    x: minX,
    y: minY,
    width,
    height,
  };
};

// Mutations
const createLabel = async (
  _: any,
  args: MutationCreateLabelArgs
): Promise<Label> => {
  const { id, imageId, labelClassId, geometry } = args.data;

  // Since we don't have any constraint checks with Dexie
  // We need to ensure that the imageId and the labelClassId
  // matches some entity before being able to continue.
  const image = await db.image.get(imageId);
  if (image == null) {
    throw new Error(`The image id ${imageId} doesn't exist.`);
  }

  if (labelClassId != null) {
    if ((await db.labelClass.get(labelClassId)) == null) {
      throw new Error(`The labelClass id ${labelClassId} doesn't exist.`);
    }
  }

  const labelId = id ?? uuidv4();
  const now = new Date();

  const {
    geometry: clippedGeometry,
    x,
    y,
    width,
    height,
  } = getBoundedGeometryFromImage(image, geometry);

  const newLabelEntity = {
    id: labelId,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    labelClassId,
    imageId,
    x,
    y,
    width,
    height,
    geometry: clippedGeometry,
  };

  await db.label.add(newLabelEntity);
  const result = await db.label.get(labelId);
  if (!result) {
    throw new Error("Could not create the label entity");
  }
  return result;
};

const deleteLabel = async (_: any, args: MutationDeleteLabelArgs) => {
  const labelId = args.where.id;

  const labelToDelete = await db.label.get(labelId);

  if (!labelToDelete) {
    throw new Error("No label with such id");
  }

  await db.label.delete(labelId);

  return labelToDelete;
};

const updateLabel = async (_: any, args: MutationUpdateLabelArgs) => {
  const labelId = args.where.id;

  if ("labelClassId" in args.data && args.data.labelClassId != null) {
    const labelClassToConnect = await db.labelClass.get(args.data.labelClassId);

    if (!labelClassToConnect) {
      throw new Error("No label class with such id");
    }
  }
  if (!args?.data?.geometry) {
    await db.label.update(labelId, args.data);

    return getLabelById(labelId);
  }

  const { imageId } = await getLabelById(labelId);
  const image = await db.image.get(imageId);
  if (image == null) {
    throw new Error(`The image id ${imageId} doesn't exist.`);
  }

  const {
    geometry: clippedGeometry,
    x,
    y,
    width,
    height,
  } = getBoundedGeometryFromImage(image, args.data.geometry);
  const now = new Date();

  const newLabelEntity = {
    ...args.data,
    updatedAt: now.toISOString(),
    geometry: clippedGeometry,
    x,
    y,
    height,
    width,
  };

  await db.label.update(labelId, newLabelEntity);

  return getLabelById(labelId);
};

const labelsAggregates = () => {
  return {};
};

const totalCount = () => {
  return db.label.count();
};

export default {
  Query: {
    label,
    labelsAggregates,
  },
  Mutation: {
    createLabel,
    deleteLabel,
    updateLabel,
  },
  Label: {
    labelClass,
  },
  LabelsAggregates: { totalCount },
};
