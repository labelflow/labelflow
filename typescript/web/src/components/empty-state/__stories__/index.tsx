import { chakraDecorator } from "../../../utils/chakra-decorator";
import {
  EmptyStateBag,
  EmptyStateCaughtUp,
  EmptyStateCreditCard,
  EmptyStateDocument,
  EmptyStateDone,
  EmptyStateGpsConnection,
  EmptyStateImage,
  EmptyStateInbox,
  EmptyStateInternetConnection,
  EmptyStateMessage,
  EmptyStateOops,
  EmptyStateResult,
} from "..";

export default {
  title: "web/Empty States",
  decorators: [chakraDecorator],
};

export const Bag = (args: {}) => <EmptyStateBag {...args} />;
export const CaughtUp = (args: {}) => <EmptyStateCaughtUp {...args} />;
export const CreditCard = (args: {}) => <EmptyStateCreditCard {...args} />;
export const Document = (args: {}) => <EmptyStateDocument {...args} />;
export const Done = (args: {}) => <EmptyStateDone {...args} />;
export const GpsConnection = (args: {}) => (
  <EmptyStateGpsConnection {...args} />
);
export const Image = (args: {}) => <EmptyStateImage {...args} />;
export const Inbox = (args: {}) => <EmptyStateInbox {...args} />;
export const InternetConnection = (args: {}) => (
  <EmptyStateInternetConnection {...args} />
);
export const Message = (args: {}) => <EmptyStateMessage {...args} />;
export const Oops = (args: {}) => <EmptyStateOops {...args} />;
export const Result = (args: {}) => <EmptyStateResult {...args} />;
