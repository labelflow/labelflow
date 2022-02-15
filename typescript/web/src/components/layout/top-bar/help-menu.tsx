import React from "react";
import NextLink from "next/link";
import {
  chakra,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuDivider,
  MenuItem,
  Tooltip,
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
import { FaRegKeyboard, FaDiscord, FaGithub, FaVoteYea } from "react-icons/fa";
import { GrGraphQl } from "react-icons/gr";

import { BoolParam } from "../../../utils/query-param-bool";
import { KeymapModal } from "./keymap-button/keymap-modal";
import { DOCUMENTATION_URL } from "../../../constants";

const HelpMenuIcon = chakra(RiQuestionLine);
const WebsiteIcon = chakra(RiGlobalLine);
const DocumentationIcon = chakra(RiBookOpenLine);
const WhatsNewIcon = chakra(RiGiftLine);
const KeymapIcon = chakra(FaRegKeyboard);
const DiscordIcon = chakra(FaDiscord);
const VoteIcon = chakra(FaVoteYea);
const GithubIcon = chakra(FaGithub);
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
        <Tooltip label="Help" openDelay={300}>
          <MenuButton
            as={IconButton}
            aria-label="Help"
            icon={<HelpMenuIcon fontSize="xl" />}
            variant="ghost"
          />
        </Tooltip>
        <MenuList>
          <MenuGroup title="Support">
            <a href={DOCUMENTATION_URL} target="_blank" rel="noreferrer">
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
            <a
              href="https://labelflow.canny.io/"
              target="_blank"
              rel="noreferrer"
            >
              <MenuItem icon={<VoteIcon fontSize="lg" />}>
                Request features
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
            <a
              href="https://github.com/labelflow/labelflow"
              target="_blank"
              rel="noreferrer"
            >
              <MenuItem icon={<GithubIcon fontSize="lg" />}>
                View source code
              </MenuItem>
            </a>
            <NextLink href="/graphiql">
              <MenuItem icon={<GraphQLIcon fontSize="lg" />}>
                GraphQL API
              </MenuItem>
            </NextLink>
            <NextLink href="/debug">
              <MenuItem icon={<DebugIcon fontSize="lg" />}>
                Debug information
              </MenuItem>
            </NextLink>
          </MenuGroup>
        </MenuList>
      </Menu>
    </>
  );
};
