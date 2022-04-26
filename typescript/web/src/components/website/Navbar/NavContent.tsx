import {
  Box,
  Button,
  ButtonProps,
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
import { Logo } from "../../logo";
import { APP_GITHUB_URL } from "../../../constants";
import { NavLink } from "./NavLink";
import { NavMenu } from "./NavMenu";
import { Submenu } from "./Submenu";
import { ToggleButton } from "./ToggleButton";
import { links } from "./_data";

const StarIcon = chakra(RiStarLine);

type GitHubButtonProps = ButtonProps & { isMobile?: boolean };

const GitHubButton = ({ isMobile, ...props }: GitHubButtonProps) => {
  const label = "Star us on GitHub";
  const mobileProps = isMobile ? { w: "full", size: "lg", mt: "5" } : {};
  return (
    <NextLink href={APP_GITHUB_URL} passHref>
      <Button
        as="a"
        target="_blank"
        rel="noreferrer"
        variant={isMobile ? "outline" : "ghost"}
        aria-label={label}
        leftIcon={<StarIcon fontSize="2xl" />}
        {...mobileProps}
        {...props}
      >
        {label}
      </Button>
    </NextLink>
  );
};

const SignInButton = ({ children = "Sign in", ...props }: ButtonProps) => (
  <NextLink href="/auth/signin">
    <Button as="a" href="#" colorScheme="brand" variant="outline" {...props}>
      {children}
    </Button>
  </NextLink>
);

const TryItNowButton = (props: ButtonProps) => (
  <SignInButton variant="solid" fontWeight="bold" {...props}>
    Try it now
  </SignInButton>
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
            <Logo h="6" />
          </Box>
        </NextLink>
        <Spacer />
        <Box display={{ base: "none", sm: "block" }}>
          <SignInButton ml="3" />
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
        <HStack mt="5">
          <SignInButton w="full" size="lg" />
          <TryItNowButton w="full" size="lg" />
        </HStack>
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
          <Logo h="6" />
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
      <HStack spacing="3" justify="space-between" align="center">
        <GitHubButton />
        <SignInButton />
        <TryItNowButton display={{ base: "none", xl: "inherit" }} />
      </HStack>
    </Flex>
  );
};

export const NavContent = {
  Mobile: MobileNavContext,
  Desktop: DesktopNavContent,
};
