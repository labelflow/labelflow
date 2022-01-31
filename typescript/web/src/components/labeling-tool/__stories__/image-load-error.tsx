import { Box } from "@chakra-ui/react";
import { DecoratorFn, Story } from "@storybook/react";
import {
  apolloMockDecorator,
  chakraDecorator,
  mockImagesLoader,
  queryParamsDecorator,
  storybookTitle,
} from "../../../utils/stories";
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
  title: storybookTitle(ImageLoadError),
  component: ImageLoadError,
  loaders: [mockImagesLoader],
  decorators: [
    inGreyBoxDecorator,
    queryParamsDecorator,
    chakraDecorator,
    apolloMockDecorator,
  ],
};

export const ErrorLoadingImage: Story = () => {
  return <ImageLoadError />;
};
