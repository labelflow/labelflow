import {
  AiAssistant,
  AI_ASSISTANTS,
  Context,
  DbDataset,
  DbImage,
  DbLabel,
  DbLabelClass,
  DbLabelClassCreateInput,
  DbLabelCreateInput,
  downloadUrlToDataUrl,
  fetchIogServer,
  getSignedImageUrl,
} from "@labelflow/common-resolvers";
import {
  LabelType,
  MutationRunAiAssistantArgs,
  RunAiAssistantOutput,
  RunIogInput,
} from "@labelflow/graphql-types";
import { getNextClassColor } from "@labelflow/utils";
import Ajv from "ajv";
import "isomorphic-fetch";
import { isEmpty, isNil } from "lodash/fp";
import { v4 as uuid } from "uuid";
import { getPrismaClient } from "../prisma-client";
import HUGGINGFACE_RESPONSE_SCHEMA from "./hugging-face-response.schema.json";

const getAiAssistant = (id: string): AiAssistant => {
  const found = AI_ASSISTANTS.find((assistant) => assistant.id === id);
  if (!isNil(found)) return found;
  throw new Error(`No AiAssistant with ID ${id}`);
};

const getImageUrl = async (imageId: string, ctx: Context): Promise<string> => {
  const db = await getPrismaClient();
  const image = await db.image.findUnique({ where: { id: imageId } });
  if (isNil(image)) {
    throw new Error(`Could not find image with ID ${imageId}`);
  }
  return await getSignedImageUrl(image.url, ctx);
};

const getImageBody = async (
  imageId: string,
  ctx: Context
): Promise<string | ArrayBuffer> => {
  const url = await getImageUrl(imageId, ctx);
  if (!url.startsWith("http://localhost")) return url;
  return await ctx.repository.upload.get(url, ctx.req);
};

type HuggingFaceBox = {
  xmin: number;
  ymin: number;
  xmax: number;
  ymax: number;
};

type HuggingFaceLabel = {
  label: string;
  score: number;
  box: HuggingFaceBox;
};

type HuggingFaceResponse = HuggingFaceLabel[];

const MIN_SCORE = 0.5;

const getHuggingFaceResponse = (body: unknown): HuggingFaceResponse => {
  const ajv = new Ajv();
  const validateResponse = ajv.compile(HUGGINGFACE_RESPONSE_SCHEMA);
  const valid = validateResponse(body);
  if (valid) return body as HuggingFaceResponse;
  const jsonBody = JSON.stringify(body, undefined, 2);
  throw new Error(`Unexpected response from HuggingFace:\n${jsonBody}`);
};

type Point2D = [number, number];

const parseBoxCoordinates = (
  { xmin, ymin, xmax, ymax }: HuggingFaceBox,
  { height }: Pick<DbImage, "height">
): Point2D[] => [
  [xmin, height - ymax],
  [xmax, height - ymax],
  [xmax, height - ymin],
  [xmin, height - ymin],
  [xmin, height - ymax],
];

type ParserLabelClass = Required<Pick<DbLabelClass, "id" | "name">> &
  Partial<Omit<DbLabelClass, "id" | "name">>;

type ParserLabel = Pick<
  DbLabel,
  "id" | "type" | "geometry" | "labelClassId" | "smartToolInput"
> &
  Partial<Pick<DbLabel, "x" | "y" | "width" | "height">>;

const mapLabelClass = (
  existing: ParserLabelClass[],
  name: string
): { labelClass: ParserLabelClass; create: boolean } => {
  const found = existing.find(
    (labelClass) => labelClass.name.toLowerCase() === name.toLowerCase()
  );
  return { create: isNil(found), labelClass: found ?? { id: uuid(), name } };
};

const constructClassificationLabel = (labelClassId: string): ParserLabel => ({
  id: uuid(),
  type: LabelType.Classification,
  labelClassId,
  geometry: { type: "none", coordinates: [] },
});

const constructObjectDetectionLabel = (
  labelClassId: string,
  coordinates: Point2D[]
): ParserLabel => {
  const { xmin, ymin, xmax, ymax } = coordinates.reduce(
    (prev, [x, y]) => ({
      xmin: Math.min(prev.xmin, x),
      ymin: Math.min(prev.ymin, y),
      xmax: Math.max(prev.xmax, x),
      ymax: Math.max(prev.ymax, y),
    }),
    {
      xmin: Number.POSITIVE_INFINITY,
      ymin: Number.POSITIVE_INFINITY,
      xmax: Number.NEGATIVE_INFINITY,
      ymax: Number.NEGATIVE_INFINITY,
    }
  );
  return {
    id: uuid(),
    type: LabelType.Box,
    geometry: { type: "Polygon", coordinates: [coordinates] },
    labelClassId,
    x: xmin,
    y: ymin,
    width: Math.abs(xmax - xmin),
    height: Math.abs(ymax - ymin),
  };
};

const parseLabel = (
  image: Pick<DbImage, "height">,
  existingLabelClasses: ParserLabelClass[],
  { box, label }: HuggingFaceLabel
): [ParserLabel, ParserLabelClass[]] => {
  const { labelClass, create } = mapLabelClass(existingLabelClasses, label);
  const newLabel = isNil(box)
    ? constructClassificationLabel(labelClass.id)
    : constructObjectDetectionLabel(
        labelClass.id,
        parseBoxCoordinates(box, image)
      );
  const newExisting = create
    ? [...existingLabelClasses, labelClass]
    : existingLabelClasses;
  return [newLabel, newExisting];
};

type ImageInfo = Pick<DbImage, "id" | "width" | "height" | "url"> & {
  dataset: Pick<DbDataset, "id"> & { labelClasses: DbLabelClass[] };
};

const getImageInfo = async (imageId: string): Promise<ImageInfo> => {
  const db = await getPrismaClient();
  const image = await db.image.findUnique({
    where: { id: imageId },
    select: {
      id: true,
      url: true,
      width: true,
      height: true,
      dataset: { select: { id: true, labelClasses: true } },
    },
  });
  if (!isNil(image)) return image;
  throw new Error("Unexpected error, image should already exist");
};

type ParsedInferenceResult = [ParserLabel[], ParserLabelClass[]];

const parseHuggingFaceResponse = (
  image: Pick<DbImage, "height">,
  existingLabelClasses: DbLabelClass[],
  result: HuggingFaceResponse
): ParsedInferenceResult => {
  const [newLabels, allLabelClasses] = result.reduce<
    [ParserLabel[], ParserLabelClass[]]
  >(
    ([prevLabels, prevLabelClasses], hfLabel) => {
      if (hfLabel.score < MIN_SCORE) return [prevLabels, prevLabelClasses];
      const [newLabel, newAllLabelClasses] = parseLabel(
        image,
        prevLabelClasses,
        hfLabel
      );
      return [[...prevLabels, newLabel], newAllLabelClasses];
    },
    [[], existingLabelClasses]
  );
  const newLabelClasses = allLabelClasses.filter(
    ({ id }) => !existingLabelClasses.some((existing) => existing.id === id)
  );
  return [newLabels, newLabelClasses];
};

const runHuggingFace = async (
  { inferenceUrl }: AiAssistant,
  imageInfo: ImageInfo,
  ctx: Context
): Promise<[ParserLabel[], ParserLabelClass[]]> => {
  const body = await getImageBody(imageInfo.id, ctx);
  const headers = {
    Authorization: `Bearer ${process.env.HUGGINGFACE_TOKEN}`,
  };
  const response = await fetch(inferenceUrl, {
    method: "POST",
    headers,
    body,
  });
  const json = await response.json();
  const hfLabels = getHuggingFaceResponse(json);
  return parseHuggingFaceResponse(
    imageInfo,
    imageInfo.dataset.labelClasses,
    hfLabels
  );
};

const runIog = async (
  { url: imageUrl, width: imageWidth, height: imageHeight }: ImageInfo,
  {
    id,
    x: labelX = 0,
    y: labelY = 0,
    width: labelWidth = 0,
    height: labelHeight = 0,
    labelClassId,
    ...label
  }: ParserLabel,
  { repository, req }: Context
): Promise<ParserLabel> => {
  const x = Math.min(imageWidth, Math.max(0, labelX ?? 0));
  const y = Math.min(imageHeight, Math.max(0, labelY ?? 0));
  const width = Math.min(imageWidth, Math.max(0, x + labelWidth ?? 0)) - x;
  const height = Math.min(imageHeight, Math.max(0, y + labelHeight ?? 0)) - y;
  const smartToolInput: Omit<RunIogInput, "imageUrl"> = {
    id,
    x,
    y,
    width,
    height,
    centerPoint: [x + width / 2, y + height / 2],
  };
  const dataUrl = await downloadUrlToDataUrl(imageUrl, repository, req);
  const iogInput: RunIogInput = { imageUrl: dataUrl, ...smartToolInput };
  const iogLabel = await fetchIogServer(iogInput);
  return {
    id,
    ...label,
    ...iogLabel,
    type: LabelType.Polygon,
    labelClassId,
    smartToolInput,
  };
};

const createEntities = async (
  { id: aiAssistantId }: AiAssistant,
  {
    id: imageId,
    width: imageWidth,
    height: imageHeight,
    dataset: { id: datasetId, labelClasses: existingLabelClasses },
  }: ImageInfo,
  [labels, labelClasses]: ParsedInferenceResult,
  { repository, user }: Context
): Promise<RunAiAssistantOutput> => {
  const existingColors = existingLabelClasses.map(({ color }) => color);
  const createdAt = new Date().toISOString();
  const [newLabelClasses] = await labelClasses.reduce<
    Promise<[DbLabelClassCreateInput[], string[]]>
  >(async (prev, labelClass, index) => {
    const [prevLabelClasses, prevColors] = await prev;
    const color = getNextClassColor(prevColors);
    const newLabelClass: DbLabelClassCreateInput = {
      ...labelClass,
      datasetId,
      color,
      index: existingLabelClasses.length + index,
      createdAt,
      updatedAt: createdAt,
    };
    return [
      [...prevLabelClasses, newLabelClass],
      [...prevColors, color],
    ];
  }, Promise.resolve([[], existingColors]));
  const addedLabelClasses = await repository.labelClass.addMany(
    { labelClasses: newLabelClasses },
    user
  );
  const labelsToAdd = labels.map<
    Omit<DbLabelCreateInput, "labelClassId" | "imageId">
  >(({ x = 0, y = 0, width = imageWidth, height = imageHeight, ...label }) => ({
    ...label,
    x,
    y,
    width,
    height,
    createdAt,
    updatedAt: createdAt,
    aiAssistantId,
  }));
  const addedLabels = await repository.label.addMany(
    { labels: labelsToAdd, imageId },
    user
  );
  const newLabels = isEmpty(addedLabels)
    ? []
    : await repository.label.list({ id: { in: addedLabels }, user });
  return {
    labels: newLabels,
    labelClasses: addedLabelClasses,
  };
};

const runAiAssistant = async (
  _: any,
  {
    data: { imageId, aiAssistantId, useAutoPolygon },
  }: MutationRunAiAssistantArgs,
  ctx: Context
): Promise<RunAiAssistantOutput> => {
  const aiAssistant = getAiAssistant(aiAssistantId);
  const imageInfo = await getImageInfo(imageId);
  const [labels, labelClasses] = await runHuggingFace(
    aiAssistant,
    imageInfo,
    ctx
  );
  const iogLabels =
    aiAssistant.labelType === LabelType.Box && useAutoPolygon
      ? await Promise.all(labels.map((label) => runIog(imageInfo, label, ctx)))
      : labels;
  return await createEntities(
    aiAssistant,
    imageInfo,
    [iogLabels, labelClasses],
    ctx
  );
};

export default { Mutation: { runAiAssistant } };
