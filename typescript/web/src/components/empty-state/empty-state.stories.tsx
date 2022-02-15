import {
  EmptyStateError,
  EmptyStateNoConnection,
  EmptyStateNoCreditCard,
  EmptyStateNoImages,
  EmptyStateNoSearchResult,
  EmptyStateNoTasks,
} from ".";
import { storybookTitle } from "../../dev/stories";

export default {
  title: storybookTitle("Empty States"),
};

export const Error = () => <EmptyStateError />;
export const NoConnection = () => <EmptyStateNoConnection />;
export const NoCreditCard = () => <EmptyStateNoCreditCard />;
export const NoImage = () => <EmptyStateNoImages />;
export const NoSearchResult = () => <EmptyStateNoSearchResult />;
export const NoTasks = () => <EmptyStateNoTasks />;
