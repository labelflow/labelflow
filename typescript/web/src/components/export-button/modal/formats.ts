import { ExportOptions, ExportFormat } from "@labelflow/graphql-types";

export type Format = keyof ExportOptions;

export const defaultOptions: ExportOptions = {
  coco: {
    exportImages: false,
  },
  yolo: {
    exportImages: false,
    includePolygons: false,
  },
};

export const formatMainInformation: {
  [format in keyof ExportOptions]: {
    format: ExportFormat;
    logoSrc: string;
    title: string;
    description: string;
  };
} = {
  coco: {
    format: ExportFormat.Coco,
    logoSrc: "/static/export-formats/coco.png",
    title: "Export to COCO",
    description: "Annotation file used with Pytorch and Detectron 2",
  },
  yolo: {
    format: ExportFormat.Yolo,
    logoSrc: "/static/export-formats/yolo.png",
    title: "Export to YOLO",
    description: "Annotation file used by YOLO frameworks",
  },
};

export const formatsOptionsInformation: {
  [formatKey in keyof ExportOptions]: {
    [optionKey in keyof ExportOptions[formatKey]]: {
      title: string;
      description: string;
    };
  };
} = {
  coco: {
    exportImages: {
      title: "Export image files",
      description: "Zip images together with the annotation file",
    },
  },
  yolo: {
    exportImages: {
      title: "Export image files",
      description: "Zip images together with the annotation directory",
    },
    includePolygons: {
      title: "Include polygons",
      description: "Replace polygons by their bounding box when exporting",
    },
  },
};
