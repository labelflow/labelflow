import { HStack } from "@chakra-ui/react";
import { Story } from "@storybook/react";
import {
  Announcements,
  AnnouncementsButton as AnnouncementsButtonComponent,
} from ".";
import { chakraDecorator } from "../../utils/stories";

const decorator = (StoryComponent: Story) => (
  <HStack>
    <StoryComponent />
  </HStack>
);

export default {
  title: `web/Announcements`,
  decorators: [chakraDecorator, decorator],
};

export const Button = () => <AnnouncementsButtonComponent />;

Button.parameters = {
  chromatic: { disableSnapshot: true },
};

export const Empty = () => <Announcements />;

Empty.parameters = {
  chromatic: { disableSnapshot: true },
};
