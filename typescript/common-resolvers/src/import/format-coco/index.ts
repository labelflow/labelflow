import JSZip, { JSZipObject } from "jszip";
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
import { convertCocoSegmentationToLabel } from "./converters";
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
  ).reduce((filesList, file) => {
    if (file !== null) {
      filesList.push(file);
    }
    return filesList;
  }, [] as JSZipObject[]);
}

async function importCocoFromZip(
  blob: Blob,
  repository: Repository,
  datasetId: string,
  user: { id: string },
  req: Request
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
    const imageFile = imageNameToFile.get(imageCoco.file_name);
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
  user: { id: string },
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
  repository: Repository,
  datasetId: string,
  user: {
    // eslint-disable-next-line no-await-in-loop
    id: string;
  },
  annotationFile: CocoDataset,
  cocoCategoryIdToLabelFlowLabelClassId: Map<number, string>,
  req: Request
) {
  const cocoCategories = await getCocoCategories(
    repository,
    datasetId,
    user,
    annotationFile,
    cocoCategoryIdToLabelFlowLabelClassId
  );
  // eslint-disable-next-line no-restricted-syntax
  for (const categoryCoco of cocoCategories) {
    const { id: labelFlowLabelClassId } =
      // eslint-disable-next-line no-await-in-loop
      await labelClassResolvers.Mutation.createLabelClass(
        null,
        {
          data: { name: categoryCoco.name, datasetId },
        },
        { repository, user, req }
      );
    cocoCategoryIdToLabelFlowLabelClassId.set(
      categoryCoco.id,
      labelFlowLabelClassId
    );
    console.log(`Created category ${categoryCoco.name}`);
  }
}

async function importCocoAnnotationsIntoLabels(
  annotationFile: CocoDataset,
  cocoImageIdToLabelFlowImageId: Map<number, string>,
  cocoCategoryIdToLabelFlowLabelClassId: Map<number, string>,
  repository: Repository,
  user: { id: string },
  req: Request
) {
  const indexedCocoImages = annotationFile.images.reduce(
    (imagesMap, image) => imagesMap.set(image.id, image),
    new Map<number, CocoImage>()
  );
  await Promise.all(
    annotationFile.annotations.map(async (annotation) => {
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
            ...convertCocoSegmentationToLabel(
              annotation.segmentation,
              indexedCocoImages.get(annotation.image_id).height
            ),
          },
        },
        { repository, user, req }
      );
      console.log(`Created annotation ${annotation.id}`);
    })
  );
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
    : await importCocoFromZip(blob, repository, datasetId, user, req);
  const images = await repository.image.list({ datasetId, user });
  const cocoImageIdToLabelFlowImageId = getCocoImageIdToLabelFlowImageId(
    annotationFile,
    images
  );
  const cocoCategoryIdToLabelFlowLabelClassId = new Map<number, string>();
  await importCocoCategoriesIntoLabelClasses(
    repository,
    datasetId,
    user,
    annotationFile,
    cocoCategoryIdToLabelFlowLabelClassId,
    req
  );
  await importCocoAnnotationsIntoLabels(
    annotationFile,
    cocoImageIdToLabelFlowImageId,
    cocoCategoryIdToLabelFlowLabelClassId,
    repository,
    user,
    req
  );
};
