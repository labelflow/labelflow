import { Box } from "@chakra-ui/react";
import { NewDatasetCard } from ".";
import {
  apolloMockDecorator,
  queryParamsDecorator,
  storybookTitle,
} from "../../dev/stories";

export default {
  title: storybookTitle(NewDatasetCard),
  decorators: [apolloMockDecorator, queryParamsDecorator],
};

export const Default = () => {
  return (
    <Box background="gray.100" padding={4} w="sm">
      <NewDatasetCard addDataset={() => {}} disabled={false} />
    </Box>
  );
};
