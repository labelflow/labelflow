import { useState, ComponentProps } from "react";
import {
  HStack,
  Button,
  Flex,
  BreadcrumbItem,
  Breadcrumb,
  BreadcrumbLink,
  Skeleton,
  Text,
  chakra,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { RiArrowRightSLine } from "react-icons/ri";
import { WorkspaceMenu } from "../workspace-menu";
import { chakraDecorator } from "../../../../utils/chakra-decorator";
import { WorkspaceItem } from "../workspace-selection-popover";

import { ResponsiveBreadcrumbs } from "../../../layout/top-bar/breadcrumbs/responsive-breadcrumbs";

const ArrowRightIcon = chakra(RiArrowRightSLine);

export default {
  title: "web/Workspace menu",
  decorators: [chakraDecorator],
};

const workspaces: WorkspaceItem[] = [
  {
    id: "coaisndoiasndi1",
    slug: "labelflow",
    name: "LabelFlow",
    src: "https://labelflow.ai/static/icon-512x512.png",
  },
  {
    id: "coaisndoiasndi2",
    slug: "sterblue",
    name: "Sterblue",
    src: "https://labelflow.ai/static/img/sterblue-logo.png",
  },
];

// const createNewWorkspace = (name: string): void => {
//   alert(`New label class created: ${name}`);
// };

// export const Default = () => {
//   const [isOpen, setIsOpen] = useState(true);
//   const [selectedLabel, setSelectedWorkspace] = useState<WorkspaceItem>(
//     workspaces[0]
//   );
//   return (
//     <Template
//       isOpen={isOpen}
//       setIsOpen={setIsOpen}
//       workspaces={workspaces}
//       onSelectedWorkspaceChange={(workspace: WorkspaceItem) =>
//         setSelectedWorkspace(workspace)
//       }
//       createNewWorkspace={createNewWorkspace}
//       selectedWorkspace={selectedLabel}
//     />
//   );
// };

// const Template = (args: ComponentProps<typeof WorkspaceMenu>) => (
//   <HStack background="white.100" padding={4} spacing={4}>
//     <WorkspaceMenu {...args} />
//     <Button variant="solid" background="white" color="gray.800">
//       Button just to compare
//     </Button>
//     <Flex> </Flex>
//   </HStack>
// );

export const Normal = () => {
  return (
    <ResponsiveBreadcrumbs>
      <NextLink href="/local/datasets">
        <BreadcrumbLink>Datasets</BreadcrumbLink>
      </NextLink>

      <NextLink href="/local/datasets/xxx/images">
        <BreadcrumbLink>Hello</BreadcrumbLink>
      </NextLink>

      <NextLink href="/local/datasets/xxx/images">
        <BreadcrumbLink>Images</BreadcrumbLink>
      </NextLink>

      <Text>World</Text>
    </ResponsiveBreadcrumbs>
  );
};
