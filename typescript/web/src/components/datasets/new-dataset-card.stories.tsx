import { Box } from "@chakra-ui/react";
import { NewDatasetCard } from ".";
import {
  apolloMockDecorator,
  chakraDecorator,
  queryParamsDecorator,
  storybookTitle,
} from "../../utils/stories";

export default {
  title: storybookTitle(NewDatasetCard),
  decorators: [chakraDecorator, apolloMockDecorator, queryParamsDecorator],
};

export const Default = () => {
  return (
    <Box background="gray.100" padding={4} w="sm">
      <NewDatasetCard addDataset={() => {}} disabled={false} />
    </Box>
  );
};
