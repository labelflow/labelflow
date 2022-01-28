import {
  Box,
  chakra,
  HStack,
  ListItem,
  UnorderedList,
  useColorModeValue as color,
} from "@chakra-ui/react";
import { RiErrorWarningFill } from "react-icons/ri";
import { Card } from "../../card";
import { useWorkspaceSettings } from "../context";

const WarningSignIcon = chakra(RiErrorWarningFill);

const WarningSign = () => (
  <Box color={color("orange.400", "light")}>
    <WarningSignIcon size="2em" />
  </Box>
);

export const DeleteWorkspaceWarning = () => {
  const { name } = useWorkspaceSettings();
  return (
    <Card bgColor={color("orange.100", "orange.600")}>
      <HStack spacing="1em">
        <WarningSign />
        <Box w="full">
          <UnorderedList>
            <ListItem>
              {"Deleting the "}
              <b>{name}</b>
              {" workspace will delete all of its images and labels"}
            </ListItem>
            <ListItem>The workspace plan will be canceled</ListItem>
            <ListItem>Every members will lose access to the workspace</ListItem>
          </UnorderedList>
        </Box>
      </HStack>
    </Card>
  );
};
