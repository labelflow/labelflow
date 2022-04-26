import { LabelType } from "@labelflow/graphql-types";

export type AiAssistant = {
  id: string;
  name: string;
  summary: string;
  inferenceUrl: string;
  iconUrl: string;
  labelType: LabelType;
};

export const DETR_COCO_AI_ASSISTANT: AiAssistant = {
  id: "b9a75ddc-60f2-4e92-a4e2-cc364ec178a0",
  name: "DETR - COCO",
  summary: "Automatic object detection across 80 classes",
  inferenceUrl:
    "https://api-inference.huggingface.co/models/facebook/detr-resnet-50",
  iconUrl: "/static/ai-assistant/b9a75ddc-60f2-4e92-a4e2-cc364ec178a0.png",
  labelType: LabelType.Box,
};

export const VIT_IMAGENET_AI_ASSISTANT: AiAssistant = {
  id: "de01cacf-611d-4624-bf71-52710244ba44",
  name: "ViT - ImageNet",
  summary: "Automatic image classification across 1000 classes",
  inferenceUrl:
    "https://api-inference.huggingface.co/models/google/vit-base-patch16-224",
  iconUrl: "/static/ai-assistant/de01cacf-611d-4624-bf71-52710244ba44.svg",
  labelType: LabelType.Classification,
};

export const AI_ASSISTANTS: AiAssistant[] = [
  DETR_COCO_AI_ASSISTANT,
  VIT_IMAGENET_AI_ASSISTANT,
];
