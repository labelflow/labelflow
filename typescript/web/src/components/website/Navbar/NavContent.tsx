import {
  chakra,
  Box,
  Button,
  Flex,
  FlexProps,
  HStack,
  useDisclosure,
  VisuallyHidden,
  Spacer,
  Link,
} from "@chakra-ui/react";
import { RiGithubFill } from "react-icons/ri";
import * as React from "react";
import NextLink from "next/link";
import { Logo } from "../Logo";
import { NavLink } from "./NavLink";
import { NavMenu } from "./NavMenu";
import { Submenu } from "./Submenu";
import { ToggleButton } from "./ToggleButton";
import { links } from "./_data";

const GithubIcon = chakra(RiGithubFill);

const GitHubButton = () => (
  <Link
    href="https://github.com/labelflow/labelflow"
    target="_blank"
    rel="noreferrer"
  >
    <Button
      aria-label="See code on github"
      variant="outline"
      leftIcon={<GithubIcon fontSize="2xl" />}
    >
      Star us on GitHub
    </Button>
  </Link>
);

const MobileNavContext = (props: FlexProps) => {
  const { isOpen, onToggle } = useDisclosure();
  return (
    <>
      <Flex align="center" className="nav-content__mobile" {...props}>
        <Box>
          <ToggleButton isOpen={isOpen} onClick={onToggle} />
        </Box>
        <NextLink href="/website">
          <Box as="a" rel="home" mx="auto" cursor="pointer">
            <Logo h="24px" iconColor="brand.400" />
          </Box>
        </NextLink>
        <Spacer />
        <GitHubButton />
        <Box display={{ base: "none", sm: "block" }}>
          <NextLink href="/local/datasets">
            <Button as="a" colorScheme="brand" variant="outline" ml="3">
              Try it now
            </Button>
          </NextLink>
        </Box>
      </Flex>
      <NavMenu animate={isOpen ? "open" : "closed"}>
        {links.map((link, idx) =>
          link.children ? (
            <Submenu.Mobile key={idx} link={link} />
          ) : (
            <NavLink.Mobile
              key={idx}
              active={false}
              href={link.href as string}
              target={link.target}
            >
              {link.label}
            </NavLink.Mobile>
          )
        )}
        <NextLink href="/local/datasets">
          <Button colorScheme="brand" w="full" size="lg" mt="5">
            Try it now
          </Button>
        </NextLink>
      </NavMenu>
    </>
  );
};

const DesktopNavContent = (props: FlexProps) => {
  return (
    <Flex
      className="nav-content__desktop"
      align="center"
      justify="space-between"
      {...props}
    >
      <NextLink href="/website">
        <Box as="a" rel="home" cursor="pointer">
          <VisuallyHidden>LabelFlow</VisuallyHidden>
          <Logo h="6" iconColor="brand.500" />
        </Box>
      </NextLink>
      <HStack
        as="ul"
        id="nav__primary-menu"
        aria-label="Main Menu"
        listStyleType="none"
      >
        {links.map((link, idx) => (
          <Box as="li" key={idx} id={`nav__menuitem-${idx}`}>
            {link.children ? (
              <Submenu.Desktop link={link} />
            ) : (
              <NavLink.Desktop
                active={false}
                href={link.href as string}
                target={link.target}
              >
                {link.label}
              </NavLink.Desktop>
            )}
          </Box>
        ))}
      </HStack>
      <HStack
        spacing="4"
        //  minW="240px"
        justify="space-between"
      >
        <GitHubButton />
        <NextLink href="/local/datasets">
          <Button
            as="a"
            href="#"
            colorScheme="brand"
            fontWeight="bold"
            variant="outline"
          >
            Try it now
          </Button>
        </NextLink>
      </HStack>
    </Flex>
  );
};

export const NavContent = {
  Mobile: MobileNavContext,
  Desktop: DesktopNavContent,
};
