import { chakraDecorator } from "../../../utils/chakra-decorator";
import {
  EmptyStateCaughtUp,
  EmptyStateCreditCard,
  EmptyStateImage,
  EmptyStateInternetConnection,
  EmptyStateOops,
  EmptyStateResult,
} from "..";

export default {
  title: "web/Empty States",
  decorators: [chakraDecorator],
};

export const CaughtUp = (args: {}) => <EmptyStateCaughtUp {...args} />;
export const CreditCard = (args: {}) => <EmptyStateCreditCard {...args} />;
export const Image = (args: {}) => <EmptyStateImage {...args} />;
export const InternetConnection = (args: {}) => (
  <EmptyStateInternetConnection {...args} />
);
export const Oops = (args: {}) => <EmptyStateOops {...args} />;
export const Result = (args: {}) => <EmptyStateResult {...args} />;
