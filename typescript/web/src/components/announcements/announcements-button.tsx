import { Box, Circle } from "@chakra-ui/react";
import { isNil } from "lodash/fp";
import { IoMegaphoneOutline } from "react-icons/io5";
import { IconButton } from "../icon-button";
import { Announcements, AnnouncementsProps } from "./announcements";
import { useAnnouncements } from "./announcements.context";

const AnnouncementsIconButton = () => {
  const { unread, openWidget } = useAnnouncements();
  const newText = unread ? ` (${unread} new)` : "";
  return (
    <IconButton
      aria-label={`Announcements${newText}`}
      icon={IoMegaphoneOutline}
      onClick={openWidget}
      variant="ghost"
    />
  );
};

export const UnreadBubble = () => {
  const { unread } = useAnnouncements();
  const showBubble = !isNil(unread) && unread > 0;
  return (
    <>
      {showBubble && (
        <Circle
          backgroundColor="red.600"
          top=".5em"
          right=".45em"
          size=".4em"
          position="absolute"
        />
      )}
    </>
  );
};

export type AnnouncementButtonProps = Omit<AnnouncementsProps, "children">;

export const AnnouncementsButton = (props: AnnouncementButtonProps) => (
  <Announcements {...props}>
    <Box position="relative">
      <AnnouncementsIconButton />
      <UnreadBubble />
    </Box>
  </Announcements>
);
