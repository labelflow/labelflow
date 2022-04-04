import { Box } from "@chakra-ui/react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { range } from "lodash/fp";
import { chakraDecorator, storybookTitle } from "../../../../utils/stories";
import { ImportButton } from "../../import-button";
import { DroppedFile } from "../types";
import { FilesStatuses as FilesStatusesComponent } from "./file-statuses";

export default {
  title: storybookTitle(ImportButton, FilesStatusesComponent),
  component: FilesStatusesComponent,
  decorators: [chakraDecorator],
} as ComponentMeta<typeof FilesStatusesComponent>;

const Template: ComponentStory<typeof FilesStatusesComponent> = (args) => (
  <Box maxW="xl">
    <FilesStatusesComponent {...args} />
  </Box>
);

export const FilesStatuses = Template.bind({});
FilesStatuses.args = {
  files: range(0, 5).map((index) => ({
    file: {
      name: `file-${index}.jpg`,
      path: `/src/file-${index}.jpg`,
    } as DroppedFile["file"],
    errors: [],
  })),
  uploadInfo: {
    "/src/file-0.jpg": { status: "loading" },
    "/src/file-1.jpg": { status: "uploaded" },
    "/src/file-2.jpg": {
      status: "uploaded",
      warnings: ["File 2 has been uploaded but it looks corrupted"],
    },
    "/src/file-3.jpg": { status: "error" },
  },
};
