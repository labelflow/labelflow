import { Flex } from "@chakra-ui/react";
import { chakraDecorator } from "../../utils/stories";
import { KpiDashboard } from "./kpi-dashboard";

export default {
  title: "web/Metabase Dashboard",
  decorators: [chakraDecorator],
};

export const Default = () => (
  <Flex maxW="1xl" w="full" orientation="column">
    <KpiDashboard />;
  </Flex>
);
