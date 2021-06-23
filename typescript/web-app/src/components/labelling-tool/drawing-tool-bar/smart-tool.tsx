import { useState } from "react";
import { useRouter } from "next/router";
import { IconButton, Tooltip } from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import { BiBrain } from "react-icons/bi";
import { gql } from "graphql-tag";
// import { useHotkeys } from "react-hotkeys-hook";

import { keymap } from "../../../keymap";

export type Props = {};

const queryImage = gql`
  query getImage($id: ID!) {
    image(where: { id: $id }) {
      id
      url
    }
  }
`;

const runSmartTool = async (
  setSmartToolRunning: (b: boolean) => void,
  imageUrl: string
) => {
  setSmartToolRunning(false);

  const image = new Image();
  image.src = imageUrl;
  image.onload = () => {};
};

export const SmartTool = () => {
  const [smartToolRunning, setSmartToolRunning] = useState(false);
  const router = useRouter();
  const imageId = router.query.id;
  const { data: image } = useQuery(queryImage, {
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
        onClick={() => runSmartTool(setSmartToolRunning, image)}
        backgroundColor="white"
        aria-label="Smart tool"
        pointerEvents="initial"
        disabled={smartToolRunning}
      />
    </Tooltip>
  );
};
