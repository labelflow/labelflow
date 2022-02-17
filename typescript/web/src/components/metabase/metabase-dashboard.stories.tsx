import { Flex } from "@chakra-ui/react";
import { chakraDecorator } from "../../utils/chakra-decorator";
import { KpiDashboard } from "./kpi-dashboard";

export default {
  title: "web/Metabase Dashboard",
  decorators: [chakraDecorator],
};

export const Default = () => (
  <Flex w="full" orientation="column">
    <KpiDashboard />;
  </Flex>
);
