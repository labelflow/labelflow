import { DecoratorFn, Story } from "@storybook/react";
import { Box } from "@chakra-ui/react";

import { chakraDecorator } from "../../../utils/chakra-decorator";
import { queryParamsDecorator } from "../../../utils/query-params-decorator";
import { apolloDecorator } from "../../../utils/apollo-decorator";

import { mockImagesLoader } from "../../../utils/mock-image-loader";
import { ImageLoadError } from "../image-load-error";

function inGreyBoxDecorator(
  storyFn: Parameters<DecoratorFn>[0]
): ReturnType<DecoratorFn> {
  return (
    <Box background="gray.100" width="640px" height="480px">
      {storyFn()}
    </Box>
  );
}

export default {
  title: "web/Image Load Error",
  component: ImageLoadError,
  loaders: [mockImagesLoader],
  decorators: [
    inGreyBoxDecorator,
    queryParamsDecorator,
    chakraDecorator,
    apolloDecorator,
  ],
};

export const ErrorLoadingImage: Story = () => {
  return <ImageLoadError />;
};
