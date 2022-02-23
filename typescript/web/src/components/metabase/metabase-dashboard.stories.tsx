import { Flex } from "@chakra-ui/react";
import { chakraDecorator } from "../../utils/stories";
import { KpiDashboard } from "./kpi-dashboard";

export default {
  title: storybookTitle(MetabaseDashboard),
  decorators: [chakraDecorator],
  parameters: {
    chromatic: { disableSnapshot: true },
  },
};

export const Default = () => (
  <Flex maxW="1xl" w="full" orientation="column">
    <KpiDashboard />;
  </Flex>
);
