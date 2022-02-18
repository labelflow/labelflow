import {
  ExportFormat,
  ExportOptions,
} from "../../../graphql-types/globalTypes";

export type Format = keyof ExportOptions;
type RequiredExportOptions = Required<ExportOptions>;

export const DEFAULT_EXPORT_OPTIONS: RequiredExportOptions = {
  coco: {
    exportImages: false,
  },
  yolo: {
    exportImages: false,
    includePolygons: false,
  },
  csv: { includeImageUrl: false },
};

export const formatMainInformation: {
  [format in keyof RequiredExportOptions]: {
    format: ExportFormat;
    logoSrc: string;
    title: string;
    description: string;
  };
} = {
  coco: {
    format: ExportFormat.COCO,
    logoSrc: "/static/export-formats/coco.png",
    title: "Export to COCO",
    description: "Annotation file used with Pytorch and Detectron 2",
  },
  yolo: {
    format: ExportFormat.YOLO,
    logoSrc: "/static/export-formats/yolo.png",
    title: "Export to YOLO",
    description: "Annotation file used by YOLO frameworks",
  },
  csv: {
    format: ExportFormat.CSV,
    logoSrc: "/static/export-formats/csv.svg",
    title: "Export to CSV",
    description: "List of classes contained in each image",
  },
};

export const formatsOptionsInformation: {
  [formatKey in keyof RequiredExportOptions]: {
    [optionKey in keyof Omit<
      Exclude<RequiredExportOptions[formatKey], null>,
      "name"
    >]: {
      title: string;
      description: string;
    };
  };
} = {
  coco: {
    exportImages: {
      title: "Export image files",
      description:
        "Zip images together with the annotation file. This will take longer to export.",
    },
    avoidImageNameCollisions: {
      title: "Avoid image names collision",
      description:
        "A unique identifier will be added to the image's name. Recommended when exporting the images.",
    },
  },
  yolo: {
    exportImages: {
      title: "Export image files",
      description:
        "Zip images together with the annotation directory. This will take longer to export.",
    },
    avoidImageNameCollisions: {
      title: "Avoid image names collision",
      description:
        "A unique identifier will be added to the image's name. Recommended when exporting the images.",
    },
    includePolygons: {
      title: "Include polygons",
      description:
        "Include polygon labels, replacing them by their bounding box when exporting.",
    },
  },
  csv: {
    includeImageUrl: {
      title: "Export image URLs",
      description: "Add a column containing images URLS, valid for 7 days",
    },
  },
};
