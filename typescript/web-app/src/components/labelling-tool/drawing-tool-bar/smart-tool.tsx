/* eslint-disable import/first */

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { IconButton, Tooltip, useToast } from "@chakra-ui/react";

import {
  ApolloClient,
  useApolloClient,
  useQuery,
  useMutation,
} from "@apollo/client";
import { BiBrain } from "react-icons/bi";
import { gql } from "graphql-tag";
import type { ObjectDetection } from "@tensorflow-models/coco-ssd";
import { useHotkeys } from "react-hotkeys-hook";

import { keymap } from "../../../keymap";
import { classesCoco } from "./smart-tool-classes";
import { hexColorSequence } from "../../../utils/class-color-generator";

export type Props = {};

const queryImage = gql`
  query getImage($id: ID!) {
    image(where: { id: $id }) {
      id
      url
      height
    }
  }
`;

const createLabelMutation = gql`
  mutation createLabel(
    $id: ID
    $imageId: ID!
    $x: Float!
    $y: Float!
    $width: Float!
    $height: Float!
    $labelClassId: ID
  ) {
    createLabel(
      data: {
        id: $id
        imageId: $imageId
        x: $x
        y: $y
        width: $width
        height: $height
        labelClassId: $labelClassId
      }
    ) {
      id
    }
  }
`;

const labelClassesQuery = gql`
  query getLabelClasses {
    labelClasses {
      id
      name
      color
    }
  }
`;

const createLabelClassQuery = gql`
  mutation createLabelClass($data: LabelClassCreateInput!) {
    createLabelClass(data: $data) {
      id
    }
  }
`;

let modelSingleton: ObjectDetection | null = null;
const getModel = async ({ toast }: { toast: ReturnType<typeof useToast> }) => {
  if (modelSingleton == null) {
    toast({
      title: "Loading the smart tool",
      description:
        "This is the first time you use the smart tool in this session, the tool is loading its resources. This only happens the first time.",
      status: "info",
      isClosable: true,
      position: "bottom-right",
      duration: 10000,
    });
    const { load } = await import("@tensorflow-models/coco-ssd");
    await Promise.all([
      import("@tensorflow/tfjs-backend-cpu"),
      import("@tensorflow/tfjs-backend-webgl"),
    ]);
    modelSingleton = await load();
  }
  return modelSingleton;
};

const runSmartTool = async (
  {
    client,
    labelClasses,
    setSmartToolRunning,
    toast,
  }: {
    client: ApolloClient<Object>;
    labelClasses: { id: string; name: string; color: string }[];
    setSmartToolRunning: (b: boolean) => void;
    toast: ReturnType<typeof useToast>;
  },
  imageData: { id: string; url: string; height: number }
) => {
  setSmartToolRunning(true);
  const imageLoadPromise = new Promise<HTMLImageElement>((resolve) => {
    const image = new Image();
    image.onload = () => {
      resolve(image);
    };
    image.src = imageData.url;
  });
  const image = await imageLoadPromise;
  const model = await getModel({ toast });
  const predictions = await model.detect(image, undefined, 0.5);
  await Promise.all(
    predictions.map((prediction) => {
      const [x, y, width, height] = prediction.bbox;
      return client.mutate({
        mutation: createLabelMutation,
        variables: {
          imageId: imageData.id,
          x,
          y: imageData.height - y - height,
          width,
          height,
          labelClassId:
            labelClasses[
              classesCoco.findIndex(
                (classCoco) => classCoco === prediction.class
              )
            ]?.id,
        },
        refetchQueries: ["getImageLabels"],
      });
    })
  );
  if (predictions.length < 1) {
    toast({
      title: "No objects were detected",
      description:
        "The automatic labelling tool did not detect any known object on the image.",
      status: "warning",
      isClosable: true,
      position: "bottom-right",
      duration: 5000,
    });
  }
  setSmartToolRunning(false);
};

export const SmartTool = () => {
  const [smartToolRunning, setSmartToolRunning] = useState(false);
  const client = useApolloClient();
  const { data: dataLabelClasses, loading } = useQuery(labelClassesQuery);
  const [createNewLabelClass] = useMutation(createLabelClassQuery);
  const labelClasses = dataLabelClasses?.labelClasses;
  useEffect(() => {
    if (!loading && labelClasses != null && labelClasses.length === 0) {
      Promise.all(
        classesCoco.map((classCoco, index) =>
          createNewLabelClass({
            variables: {
              data: {
                name: classCoco,
                color: hexColorSequence[index % hexColorSequence.length],
              },
            },
          })
        )
      );
    }
  }, [loading, labelClasses]);
  const router = useRouter();
  const imageId = router.query.id;
  const { data } = useQuery(queryImage, {
    variables: { id: imageId },
    skip: imageId == null,
  });
  const toast = useToast();

  const doRunSmartTool = useCallback((): void => {
    runSmartTool(
      { setSmartToolRunning, client, labelClasses, toast },
      data?.image
    );
  }, [setSmartToolRunning, client, labelClasses, toast, data?.image]);
  useHotkeys(keymap.toolSmart.key, doRunSmartTool, {}, [doRunSmartTool]);

  return (
    <Tooltip
      label={`Smart tool [${keymap.toolSmart.key}]`}
      placement="right"
      openDelay={300}
    >
      <IconButton
        icon={<BiBrain size="1.3em" />}
        role="checkbox"
        onClick={doRunSmartTool}
        backgroundColor="white"
        aria-label="Smart tool"
        pointerEvents="initial"
        disabled={smartToolRunning}
        isLoading={smartToolRunning}
      />
    </Tooltip>
  );
};
