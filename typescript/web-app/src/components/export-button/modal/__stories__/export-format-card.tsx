import { HStack } from "@chakra-ui/react";

import { ExportFormatCard } from "../export-format-card";

import { chakraDecorator } from "../../../../utils/chakra-decorator";
import { apolloDecorator } from "../../../../utils/apollo-decorator";

export default {
  title: "web-app/Export Button/export format card",
  decorators: [chakraDecorator, apolloDecorator],
};

export const COCO = () => {
  return (
    <ExportFormatCard
      colorScheme="brand"
      logoSrc="/static/export-formats/coco.png"
      title="Export to COCO"
      subtext="Annotation file used with Pytorch and Detectron 2"
    />
  );
};

export const Loading = () => {
  return (
    <ExportFormatCard
      loading
      colorScheme="brand"
      logoSrc="/static/export-formats/coco.png"
      title="Export to COCO"
      subtext="Annotation file used with Pytorch and Detectron 2"
    />
  );
};

export const Disabled = () => {
  return (
    <ExportFormatCard
      disabled
      colorScheme="gray"
      logoSrc="/static/export-formats/tensorflow-grey.png"
      title="Export to TensorFlow (soon)"
      subtext="TF Object Detection file in its human readable format"
    />
  );
};

export const TensorFlow = () => {
  return (
    <ExportFormatCard
      colorScheme="gray"
      logoSrc="/static/export-formats/tensorflow-grey.png"
      title="Export to TensorFlow (soon)"
      subtext="TF Object Detection file in its human readable format"
    />
  );
};
TensorFlow.storyName = "TensorFlow";

export const SideBySide = () => {
  return (
    <HStack spacing="4">
      <ExportFormatCard
        colorScheme="brand"
        logoSrc="/static/export-formats/coco.png"
        title="Export to COCO"
        subtext="Annotation file used with Pytorch and Detectron 2"
      />
      <ExportFormatCard
        colorScheme="gray"
        logoSrc="/static/export-formats/tensorflow-grey.png"
        title="Export to TensorFlow (soon)"
        subtext="TF Object Detection file in its human readable format"
      />
    </HStack>
  );
};

export const SideBySideWithOneDisabled = () => {
  return (
    <HStack spacing="4">
      <ExportFormatCard
        colorScheme="brand"
        logoSrc="/static/export-formats/coco.png"
        title="Export to COCO"
        subtext="Annotation file used with Pytorch and Detectron 2"
      />
      <ExportFormatCard
        disabled
        colorScheme="gray"
        logoSrc="/static/export-formats/tensorflow-grey.png"
        title="Export to TensorFlow (soon)"
        subtext="TF Object Detection file in its human readable format"
      />
    </HStack>
  );
};

export const SideBySideWithOneLoadingAndOneDisabled = () => {
  return (
    <HStack spacing="4">
      <ExportFormatCard
        loading
        colorScheme="brand"
        logoSrc="/static/export-formats/coco.png"
        title="Export to COCO"
        subtext="Annotation file used with Pytorch and Detectron 2"
      />
      <ExportFormatCard
        disabled
        colorScheme="gray"
        logoSrc="/static/export-formats/tensorflow-grey.png"
        title="Export to TensorFlow (soon)"
        subtext="TF Object Detection file in its human readable format"
      />
    </HStack>
  );
};
