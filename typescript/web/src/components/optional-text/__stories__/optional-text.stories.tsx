import { OptionalText } from "..";
import { chakraDecorator } from "../../../utils/chakra-decorator";

export default {
  title: `web/${OptionalText.name}`,
  component: OptionalText,
  decorators: [chakraDecorator],
};

export const WithText = OptionalText.bind({ text: "Some text" });

export const WithError = OptionalText.bind({ error: "An error occurred" });

export const WithTextAndError = OptionalText.bind({
  text: "Some text",
  error: "An error occurred",
});
