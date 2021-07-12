import { v4 as uuidv4 } from "uuid";
import { bboxPolygon, polygon, intersect, bbox } from "@turf/turf";

import type {
  GeometryInput,
  Label,
  MutationCreateLabelArgs,
  MutationDeleteLabelArgs,
  MutationUpdateLabelArgs,
  QueryLabelArgs,
} from "../../graphql-types.generated";
import { db, DbLabel, DbImage } from "../database";

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

const cleanGeometryWithinImage = (geometry: GeometryInput, image: DbImage) => {
  const geometryPolygon = polygon(geometry.coordinates);
  const imagePolygon = bboxPolygon([0, 0, image.width, image.height]);
  // const noKinksPolygon = turf.unkinkPolygon(geometry);
  return intersect(imagePolygon, geometryPolygon);
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

  const clippedGeometryObject = cleanGeometryWithinImage(geometry, image);

  if (clippedGeometryObject?.geometry == null) {
    throw new Error("Bounding box out of image bounds");
  }

  const [minX, minY, maxX, maxY] = bbox(clippedGeometryObject.geometry);
  const width = maxX - minX;
  const height = maxY - minY;

  const newLabelEntity = {
    id: labelId,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    labelClassId,
    imageId,
    x: minX,
    y: minY,
    geometry: clippedGeometryObject.geometry,
    height,
    width,
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
  const labelData = await getLabelById(labelId);
  const imageId = labelData?.imageId;
  const image = await db.image.get(imageId);
  const clippedGeometryObject = cleanGeometryWithinImage(
    args?.data?.geometry,
    image as DbImage
  );

  if (clippedGeometryObject?.geometry == null) {
    throw new Error("Bounding box out of image bounds");
  }

  const now = new Date();
  const [minX, minY, maxX, maxY] = bbox(clippedGeometryObject.geometry);
  const width = maxX - minX;
  const height = maxY - minY;

  const newLabelEntity = {
    ...args.data,
    updatedAt: now.toISOString(),
    x: minX,
    y: minY,
    geometry: clippedGeometryObject.geometry,
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
