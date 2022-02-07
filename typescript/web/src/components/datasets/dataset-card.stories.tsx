import { Box } from "@chakra-ui/react";
import { omit } from "lodash/fp";
import { DatasetCard } from ".";
import {
  apolloMockDecorator,
  chakraDecorator,
  queryParamsDecorator,
  storybookTitle,
} from "../../utils/stories";

export default {
  title: storybookTitle(DatasetCard),
  decorators: [chakraDecorator, apolloMockDecorator, queryParamsDecorator],
};

const property = {
  url: "#",
  imageUrl: "https://bit.ly/2Z4KKcF",
  imageAlt: "Rear view of modern home with pool",
  datasetName: "A dataset name",
  imagesCount: 15,
  labelClassesCount: 10,
  labelsCount: 0,
  editDataset: () => console.log("Edit dataset button click"),
  deleteDataset: () => console.log("Delete dataset button click"),
};

const Template = (args: any) => (
  <Box background="gray.100" padding={4}>
    <DatasetCard {...args} />
  </Box>
);

export const Default = () => {
  return <Template {...property} />;
};

export const NoImages = () => {
  return <Template {...omit(["imageUrl"], property)} />;
};

export const OverflowingValues = () => {
  return (
    <Template
      {...property}
      {...{
        datasetName: "lkfhslkmhsefkvznlefksjpaieuraizerzier",
        imagesCount: 1588986473693642,
        labelClassesCount: 10870827847289374,
        labelsCount: 987837807389792,
      }}
    />
  );
};
