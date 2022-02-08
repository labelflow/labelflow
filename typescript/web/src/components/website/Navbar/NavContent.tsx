import {
  Box,
  Button,
  chakra,
  Flex,
  FlexProps,
  HStack,
  Spacer,
  useDisclosure,
  VisuallyHidden,
} from "@chakra-ui/react";
import NextLink from "next/link";
import * as React from "react";
import { RiStarLine } from "react-icons/ri";
import { Logo } from "../Logo";
import { NavLink } from "./NavLink";
import { NavMenu } from "./NavMenu";
import { Submenu } from "./Submenu";
import { ToggleButton } from "./ToggleButton";
import { links } from "./_data";

const StarIcon = chakra(RiStarLine);

const GitHubButton = ({ isMobile }: { isMobile?: boolean }) => {
  const label = "Star us on GitHub";
  const mobileProps = isMobile ? { w: "full", size: "lg", mt: "5" } : {};
  return (
    <NextLink href="https://github.com/labelflow/labelflow" passHref>
      <Button
        as="a"
        target="_blank"
        rel="noreferrer"
        variant={isMobile ? "outline" : "ghost"}
        aria-label={label}
        leftIcon={<StarIcon fontSize="2xl" />}
        {...mobileProps}
      >
        {label}
      </Button>
    </NextLink>
  );
};

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
        <Box display={{ base: "none", sm: "block" }}>
          <NextLink href="/test/datasets">
            <Button colorScheme="brand" variant="outline" ml="3">
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
        <NextLink href="/test/datasets">
          <Button colorScheme="brand" w="full" size="lg" mt="5">
            Try it now
          </Button>
        </NextLink>
        <GitHubButton isMobile />
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
      <HStack spacing="4" justify="space-between" align="center">
        <GitHubButton />
        <NextLink href="/test/datasets">
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
