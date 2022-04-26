import {
  EmptyStateError,
  EmptyStateNoConnection,
  EmptyStateNoCreditCard,
  EmptyStateNoImages,
  EmptyStateNoSearchResult,
  EmptyStateNoTasks,
} from ".";
import { chakraDecorator, storybookTitle } from "../../utils/stories";

export default {
  title: storybookTitle("Empty States"),
  decorators: [chakraDecorator],
};

export const Error = () => <EmptyStateError />;
export const NoConnection = () => <EmptyStateNoConnection />;
export const NoCreditCard = () => <EmptyStateNoCreditCard />;
export const NoImage = () => <EmptyStateNoImages />;
export const NoSearchResult = () => <EmptyStateNoSearchResult />;
export const NoTasks = () => <EmptyStateNoTasks />;
