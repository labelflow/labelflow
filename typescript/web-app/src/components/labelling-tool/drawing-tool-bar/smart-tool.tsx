/* eslint-disable import/first */
require("@tensorflow/tfjs-backend-cpu");
require("@tensorflow/tfjs-backend-webgl");

import { useState } from "react";
import { useRouter } from "next/router";
import { IconButton, Tooltip } from "@chakra-ui/react";
import {
  ApolloClient,
  InMemoryCache,
  useApolloClient,
  useQuery,
} from "@apollo/client";
import { BiBrain } from "react-icons/bi";
import { gql } from "graphql-tag";
import { load } from "@tensorflow-models/coco-ssd";
// import { useHotkeys } from "react-hotkeys-hook";

import { keymap } from "../../../keymap";

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

const modelPromise = load();

const runSmartTool = async (
  setSmartToolRunning: (b: boolean) => void,
  imageData: { id: string; url: string; height: number },
  client: ApolloClient<Object>
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
  const model = await modelPromise;
  const predictions = await model.detect(image);
  console.log("Predictions", predictions);
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
          labelClassId: null,
        },
        refetchQueries: ["getImageLabels"],
      });
    })
  );
  setSmartToolRunning(false);
};

export const SmartTool = () => {
  const [smartToolRunning, setSmartToolRunning] = useState(false);
  const client = useApolloClient();
  const router = useRouter();
  const imageId = router.query.id;
  const { data } = useQuery(queryImage, {
    variables: { id: imageId },
    skip: imageId == null,
  });
  // useHotkeys(keymap.toolSelect.key, () => setSelectedTool(Tools.SMART), {}, []);

  return (
    <Tooltip
      label={`Smart tool [${keymap.toolSelect.key}]`}
      placement="right"
      openDelay={300}
    >
      <IconButton
        icon={<BiBrain size="1.3em" />}
        role="checkbox"
        onClick={() => runSmartTool(setSmartToolRunning, data?.image, client)}
        backgroundColor="white"
        aria-label="Smart tool"
        pointerEvents="initial"
        disabled={smartToolRunning}
      />
    </Tooltip>
  );
};
