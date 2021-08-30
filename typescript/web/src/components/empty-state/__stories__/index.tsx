import { chakraDecorator } from "../../../utils/chakra-decorator";
import {
  EmptyStateNoTasks,
  EmptyStateNoCreditCard,
  EmptyStateNoImages,
  EmptyStateNoConnection,
  EmptyStateError,
  EmptyStateNoSearchResult,
} from "..";

export default {
  title: "web/Empty States",
  decorators: [chakraDecorator],
};

export const Error = () => <EmptyStateError />;
export const NoConnection = () => <EmptyStateNoConnection />;
export const NoCreditCard = () => <EmptyStateNoCreditCard />;
export const NoImage = () => <EmptyStateNoImages />;
export const NoSearchResult = () => <EmptyStateNoSearchResult />;
export const NoTasks = () => <EmptyStateNoTasks />;
