import JSZip from "jszip";
import path from "path";
import { v4 as uuidv4 } from "uuid";

import type { UploadTargetHttp } from "@labelflow/graphql-types";

import { ImportFunction } from "../types";
import imageResolvers from "../../image";
import labelClassResolvers from "../../label-class";
import labelResolvers from "../../label";
import {
  CocoDataset,
  CocoImage,
} from "../../export/format-coco/coco-core/types";
import { Context, Repository, DbImage } from "../../types";
import { convertGeometryFromCocoAnnotationToLabel } from "./converters";
import { getOrigin } from "../../utils/get-origin";
import {
  isJSZipObjectOfValidMimeTypeCategory,
  ValidMimeTypeCategory,
} from "../../utils/validate-upload-mime-types";

const uploadImage = async (
  file: JSZip.JSZipObject,
  name: string,
  datasetId: string,
  { repository, req, user }: Context
) => {
  const fileBlob = new Blob([await file.async("arraybuffer", () => {})]);
  const origin = getOrigin(req);
  const uploadTarget = await repository.upload.getUploadTarget(
    uuidv4(),
    origin
  );
  if (!(uploadTarget as UploadTargetHttp)?.downloadUrl) {
    throw new Error("Can't direct upload this image.");
  }
  await repository.upload.put(
    (uploadTarget as UploadTargetHttp)?.uploadUrl,
    fileBlob,
    req
  );
  return await imageResolvers.Mutation.createImage(
    null,
    {
      data: {
        url: (uploadTarget as UploadTargetHttp)?.downloadUrl,
        name,
        datasetId,
      },
    },
    { repository, req, user }
  );
};

async function getAnnotationFileFromZip(zip: JSZip) {
  const annotationsFilesJSZip = zip.filter(
    (relativePath) => path.extname(relativePath) === ".json"
  );
  if (annotationsFilesJSZip.length === 0) {
    throw new Error("No COCO annotation file was found in the zip file.");
  }
  if (annotationsFilesJSZip.length > 1) {
    throw new Error(
      "More than one COCO annotation file was found in the zip file."
    );
  }
  const annotationFile: CocoDataset = JSON.parse(
    await annotationsFilesJSZip[0].async("string", () => {})
  );
  return annotationFile;
}

async function getImageFilesFromZip(zip: JSZip) {
  return (
    await Promise.all(
      Object.values(zip.files).map(async (file) =>
        (await isJSZipObjectOfValidMimeTypeCategory(
          file.name,
          file,
          ValidMimeTypeCategory.image
        ))
          ? file
          : null
      )
    )
  ).filter((file) => file !== null) as JSZip.JSZipObject[];
}

async function importCocoFromZip(
  blob: Blob,
  datasetId: string,
  { repository, req, user }: Context
) {
  const zip = await JSZip.loadAsync(await blob.arrayBuffer()); // Passing to array buffer to avoid issues with jszip
  const annotationFile: CocoDataset = await getAnnotationFileFromZip(zip);
  const imageFiles = await getImageFilesFromZip(zip);
  const imageNameToFile = imageFiles.reduce(
    (imageNameToFileCurrent, imageFile) => {
      imageNameToFileCurrent.set(path.basename(imageFile.name), imageFile);
      return imageNameToFileCurrent;
    },
    new Map<string, JSZip.JSZipObject>()
  );
  // Manage coco images => labelflow images
  const images = await repository.image.list({ datasetId, user });
  const imagesCoco = annotationFile.images.filter(
    (imageCoco) =>
      !images.find(
        (image) =>
          image.name ===
          imageCoco.file_name.replace(
            new RegExp(`\\${path.extname(imageCoco.file_name)}$`),
            ""
          )
      )
  );
  // eslint-disable-next-line no-restricted-syntax
  for (const imageCoco of imagesCoco) {
    if (!imageNameToFile.has(imageCoco.file_name)) {
      throw new Error(
        `Image declared in the COCO annotation file was not found in the zip file: ${imageCoco.file_name}`
      );
    }
    const imageFile = imageNameToFile.get(imageCoco.file_name)!;
    // eslint-disable-next-line no-await-in-loop
    await uploadImage(imageFile, imageCoco.file_name, datasetId, {
      repository,
      req,
      user,
    });
    // cocoImageIdToLabelFlowImageId.set(imageCoco.id, labelFlowImageId);
    console.log(`Created image ${imageCoco.file_name}`);
  }
  return annotationFile;
}

function getCocoImageIdToLabelFlowImageId(
  annotationFile: CocoDataset,
  images: DbImage[]
) {
  return annotationFile.images.reduce((currentMap, imageCoco) => {
    const labelFlowImage = images.find(
      (image) =>
        image.name ===
        imageCoco.file_name.replace(
          new RegExp(`\\${path.extname(imageCoco.file_name)}$`),
          ""
        )
    );
    if (labelFlowImage) {
      currentMap.set(imageCoco.id, labelFlowImage.id);
    }
    return currentMap;
  }, new Map<number, string>());
}

async function getCocoCategories(
  repository: Repository,
  datasetId: string,
  user: { id: string } | undefined,
  annotationFile: CocoDataset,
  cocoCategoryIdToLabelFlowLabelClassId: Map<number, string>
) {
  const labelClasses = await repository.labelClass.list({ datasetId, user });
  const cocoCategories = annotationFile.categories.filter((categoryCoco) => {
    const labelFlowLabelClass = labelClasses.find(
      (labelClass) => labelClass.name === categoryCoco.name
    );
    if (labelFlowLabelClass) {
      cocoCategoryIdToLabelFlowLabelClassId.set(
        categoryCoco.id,
        labelFlowLabelClass.id
      );
      return false;
    }
    return true;
  });
  return cocoCategories;
}

async function importCocoCategoriesIntoLabelClasses(
  datasetId: string,
  annotationFile: CocoDataset,
  cocoCategoryIdToLabelFlowLabelClassId: Map<number, string>,
  { repository, req, user }: Context
) {
  const cocoCategories = await getCocoCategories(
    repository,
    datasetId,
    user,
    annotationFile,
    cocoCategoryIdToLabelFlowLabelClassId
  );
  // eslint-disable-next-line no-restricted-syntax
  for (const cocoCategory of cocoCategories) {
    const { id: labelFlowLabelClassId } =
      // eslint-disable-next-line no-await-in-loop
      await labelClassResolvers.Mutation.createLabelClass(
        null,
        {
          data: { name: cocoCategory.name, datasetId },
        },
        { repository, user, req }
      );
    cocoCategoryIdToLabelFlowLabelClassId.set(
      cocoCategory.id,
      labelFlowLabelClassId
    );
    console.log(`Created category ${cocoCategory.name}`);
  }
}

function getSkippedCrowdAnnotationsWarning(
  skippedCrowdAnnotations: number
): string | undefined {
  return skippedCrowdAnnotations > 0
    ? `${skippedCrowdAnnotations} RLE bitmap annotations were ignored. Only polygon annotations are supported.`
    : undefined;
}

async function importCocoAnnotationsIntoLabels(
  annotationFile: CocoDataset,
  cocoImageIdToLabelFlowImageId: Map<number, string>,
  cocoCategoryIdToLabelFlowLabelClassId: Map<number, string>,
  { repository, req, user }: Context
): Promise<{ warning: string | undefined }> {
  const indexedCocoImages = annotationFile.images.reduce(
    (imagesMap, image) => imagesMap.set(image.id, image),
    new Map<number, CocoImage>()
  );
  const annotationsToImport = annotationFile.annotations.filter(
    (annotation) => annotation.iscrowd !== 1
  );
  const skippedCrowdAnnotations =
    annotationFile.annotations.length - annotationsToImport.length;
  await Promise.all(
    annotationsToImport.map(async (annotation) => {
      if (!cocoImageIdToLabelFlowImageId.has(annotation.image_id)) {
        throw new Error(
          `Image ${annotation.image_id} referenced in annotation does not exist.`
        );
      }
      await labelResolvers.Mutation.createLabel(
        null,
        {
          data: {
            imageId: cocoImageIdToLabelFlowImageId.get(
              annotation.image_id
            ) as string,
            labelClassId: cocoCategoryIdToLabelFlowLabelClassId.get(
              annotation.category_id
            ),
            ...convertGeometryFromCocoAnnotationToLabel(
              annotation.segmentation,
              annotation.bbox,
              indexedCocoImages.get(annotation.image_id)!.height
            ),
          },
        },
        { repository, user, req }
      );
      console.log(`Created annotation ${annotation.id}`);
    })
  );
  return {
    warning: getSkippedCrowdAnnotationsWarning(skippedCrowdAnnotations),
  };
}

export const importCoco: ImportFunction = async (
  blob,
  datasetId,
  { repository, req, user },
  options
) => {
  // options.annotationsOnly == true means that blob is the annotations JSON
  // Otherwise blob is a zip file containing the JSON as well as images
  const annotationFile: CocoDataset = options?.annotationsOnly
    ? JSON.parse(await blob.text())
    : await importCocoFromZip(blob, datasetId, { repository, req, user });
  const images = await repository.image.list({ datasetId, user });
  const cocoImageIdToLabelFlowImageId = getCocoImageIdToLabelFlowImageId(
    annotationFile,
    images
  );
  const cocoCategoryIdToLabelFlowLabelClassId = new Map<number, string>();
  await importCocoCategoriesIntoLabelClasses(
    datasetId,
    annotationFile,
    cocoCategoryIdToLabelFlowLabelClassId,
    { repository, req, user }
  );
  const { warning } = await importCocoAnnotationsIntoLabels(
    annotationFile,
    cocoImageIdToLabelFlowImageId,
    cocoCategoryIdToLabelFlowLabelClassId,
    { repository, req, user }
  );
  return { warnings: warning ? [warning] : undefined };
};
