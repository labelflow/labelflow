import { Text } from "@chakra-ui/react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { ImageWithFallback, ImageWithFallbackProps } from ".";
import { chakraDecorator, storybookTitle } from "../../../utils/stories";
import { createTextImage } from "../../../utils/stories/create-text-image";

export default {
  title: storybookTitle("Core", ImageWithFallback),
  component: ImageWithFallback,
  decorators: [chakraDecorator],
} as ComponentMeta<typeof ImageWithFallback>;

const Template: ComponentStory<typeof ImageWithFallback> = (props) => (
  <ImageWithFallback {...props} />
);

const OK_SRC = createTextImage("OK", { color: "green" });

const LOADING_SRC = "we use onError to trick the component";

const ERROR_SRC = "this URL is invalid";

const FALLBACKS_SRC: Pick<
  ImageWithFallbackProps,
  "loadingFallbackSrc" | "errorFallbackSrc"
> = {
  loadingFallbackSrc: createTextImage("Loading", { color: "yellow" }),
  errorFallbackSrc: createTextImage("Error", { color: "red" }),
};

export const OkWithSrc = Template.bind({});
OkWithSrc.args = {
  ...FALLBACKS_SRC,
  src: OK_SRC,
};

export const LoadingWithSrc = Template.bind({});
LoadingWithSrc.args = {
  ...FALLBACKS_SRC,
  src: LOADING_SRC,
  onError: () => {},
};

export const ErrorWithSrc = Template.bind({});
ErrorWithSrc.args = {
  ...FALLBACKS_SRC,
  src: ERROR_SRC,
};

const FALLBACKS_COMPONENTS: Pick<
  ImageWithFallbackProps,
  "loadingFallback" | "errorFallback"
> = {
  loadingFallback: <Text>Loading...</Text>,
  errorFallback: <Text>Error!</Text>,
};

export const OkWithComponents = Template.bind({});
OkWithComponents.args = {
  ...FALLBACKS_COMPONENTS,
  src: OK_SRC,
};

export const LoadingWithComponents = Template.bind({});
LoadingWithComponents.args = {
  ...FALLBACKS_COMPONENTS,
  src: LOADING_SRC,
  onError: () => {},
};

export const ErrorWithComponents = Template.bind({});
ErrorWithComponents.args = {
  ...FALLBACKS_COMPONENTS,
  src: ERROR_SRC,
};
