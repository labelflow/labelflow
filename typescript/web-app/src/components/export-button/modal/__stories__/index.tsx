import { addDecorator } from "@storybook/react";

import { ExportFormatCard } from "../export-format-card";
import { chakraDecorator } from "../../../../utils/chakra-decorator";
import { apolloDecorator } from "../../../../utils/apollo-decorator";

addDecorator(chakraDecorator);
addDecorator(apolloDecorator);

export default {
  title: "web-app/Export Button/export format card",
};

export const COCO = () => {
  return (
    <ExportFormatCard
      colorScheme="brand"
      logoSrc="/assets/export-formats/coco.png"
      title="Export to COCO"
      tag="JSON"
      subtext="Annotation file used with Pytorch and Detectron 2"
    />
  );
};

export const TensorFlow = () => {
  return (
    <ExportFormatCard
      colorScheme="gray"
      logoSrc="/assets/export-formats/tensorflow-grey.png"
      title="Export to TensorFlow (soon)"
      tag="CSV"
      subtext="TF Object Detection file in its human readable format"
    />
  );
};
TensorFlow.storyName = "TensorFlow";
