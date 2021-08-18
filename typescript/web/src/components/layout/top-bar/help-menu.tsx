import React from "react";
import NextLink from "next/link";
import {
  chakra,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuDivider,
  MenuItem,
  MenuGroup,
} from "@chakra-ui/react";
import { useQueryParam } from "use-query-params";
import {
  RiQuestionLine,
  RiGlobalLine,
  RiGiftLine,
  RiBookOpenLine,
} from "react-icons/ri";
import { VscDebug } from "react-icons/vsc";
import { FaRegKeyboard, FaDiscord } from "react-icons/fa";
import { GrGraphQl } from "react-icons/gr";

import { BoolParam } from "../../../utils/query-param-bool";
import { KeymapModal } from "./keymap-button/keymap-modal";

const HelpMenuIcon = chakra(RiQuestionLine);
const WebsiteIcon = chakra(RiGlobalLine);
const DocumentationIcon = chakra(RiBookOpenLine);
const WhatsNewIcon = chakra(RiGiftLine);
const KeymapIcon = chakra(FaRegKeyboard);
const DiscordIcon = chakra(FaDiscord);
const GraphQLIcon = chakra(GrGraphQl);
const DebugIcon = chakra(VscDebug);

export const HelpMenu = () => {
  const [isOpen, setIsOpen] = useQueryParam("modal-keymap", BoolParam);

  return (
    <>
      <KeymapModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false, "replaceIn")}
      />

      <Menu>
        <MenuButton
          as={Button}
          aria-label="Help"
          rightIcon={<HelpMenuIcon fontSize="xl" />}
          variant="ghost"
        >
          Help
        </MenuButton>
        <MenuList>
          <MenuGroup title="Support">
            <a
              href="https://labelflow.gitbook.io/labelflow/"
              target="_blank"
              rel="noreferrer"
            >
              <MenuItem icon={<DocumentationIcon fontSize="lg" />}>
                Documentation
              </MenuItem>
            </a>

            <a
              href="https://discord.gg/sHtanUQA2V"
              target="_blank"
              rel="noreferrer"
            >
              <MenuItem icon={<DiscordIcon fontSize="lg" />}>
                Ask the community
              </MenuItem>
            </a>
          </MenuGroup>
          <MenuDivider />
          <MenuGroup title="Education">
            <MenuItem
              icon={<KeymapIcon fontSize="lg" />}
              onClick={() => setIsOpen(true, "replaceIn")}
            >
              Keyboard shortcuts
            </MenuItem>
            <NextLink href="/posts">
              <MenuItem icon={<WhatsNewIcon fontSize="lg" />}>
                What&apos;s new
              </MenuItem>
            </NextLink>
            <NextLink href="/website">
              <MenuItem icon={<WebsiteIcon fontSize="lg" />}>
                Visit website
              </MenuItem>
            </NextLink>
          </MenuGroup>
          <MenuDivider />
          <MenuGroup title="Technical">
            <NextLink href="/graphiql">
              <MenuItem icon={<GraphQLIcon fontSize="lg" />}>
                GraphQL API
              </MenuItem>
            </NextLink>
            <NextLink href="/debug">
              <MenuItem icon={<DebugIcon fontSize="lg" />}>
                Version information
              </MenuItem>
            </NextLink>
          </MenuGroup>
        </MenuList>
      </Menu>
    </>
  );
};
