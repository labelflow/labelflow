import { RefObject, useState, useLayoutEffect, useCallback } from "react";

import fscreen from "fscreen";
import {
  IconButton,
  chakra,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { RiFullscreenLine, RiFullscreenExitLine } from "react-icons/ri";
import { useHotkeys } from "react-hotkeys-hook";

import { isInWindowScope } from "../../../utils/detect-scope";
import { keymap } from "../../../keymap";

const FullscreenIcon = chakra(RiFullscreenLine);
const FullscreenExitIcon = chakra(RiFullscreenExitLine);

const noOp = () => {};

// See https://raobotics.com/blog/react-fullscreen
export function useFullscreen(fullscreenRef: RefObject<HTMLDivElement>) {
  const [active, setActive] = useState(false);
  const handleChange = useCallback(() => {
    setActive(fscreen.fullscreenElement === fullscreenRef.current);
  }, [fullscreenRef]);
  useLayoutEffect(() => {
    if (!isInWindowScope) return () => {};
    fscreen.addEventListener("fullscreenchange", handleChange);
    return () => fscreen.removeEventListener("fullscreenchange", handleChange);
  });
  const enterFullscreen = useCallback(() => {
    if (fscreen.fullscreenElement) {
      fscreen.exitFullscreen();
    }
    if (fullscreenRef.current) {
      fscreen.requestFullscreen(fullscreenRef.current);
    }
  }, [fullscreenRef]);
  const exitFullscreen = useCallback(() => {
    if (fscreen.fullscreenElement === fullscreenRef.current) {
      fscreen.exitFullscreen();
    }
  }, [fullscreenRef]);
  return isInWindowScope
    ? {
        fullscreenEnabled: fscreen.fullscreenEnabled,
        fullscreenActive: active,
        enterFullscreen,
        exitFullscreen,
      }
    : {
        fullscreenEnabled: true,
        fullscreenActive: false,
        enterFullscreen: noOp,
        exitFullscreen: noOp,
      };
}

export const FullScreenTool = ({
  containerRef,
}: {
  containerRef: RefObject<HTMLDivElement>;
}) => {
  const {
    fullscreenActive,
    fullscreenEnabled,
    enterFullscreen,
    exitFullscreen,
  } = useFullscreen(containerRef);

  useHotkeys(
    keymap.enterFullScreen.key,
    () => {
      if (fullscreenActive) {
        exitFullscreen();
        return;
      }
      enterFullscreen();
    },
    {},
    [enterFullscreen, exitFullscreen, fullscreenActive]
  );

  const buttonBg = useColorModeValue("white", "gray.800");

  if (fullscreenActive) {
    return (
      <Tooltip
        label={`Exit Full Screen [${keymap.enterFullScreen.key}]`}
        placement="left"
        openDelay={300}
      >
        <IconButton
          icon={<FullscreenExitIcon fontSize="lg" />}
          backgroundColor={buttonBg}
          aria-label="Exit Full Screen"
          pointerEvents="initial"
          isDisabled={false}
          onClick={exitFullscreen}
        />
      </Tooltip>
    );
  }
  return (
    <Tooltip
      label={`Enter Full Screen [${keymap.enterFullScreen.key}]`}
      placement="left"
      openDelay={300}
    >
      <IconButton
        icon={<FullscreenIcon fontSize="lg" />}
        backgroundColor={buttonBg}
        aria-label="Enter Full Screen"
        pointerEvents="initial"
        isDisabled={containerRef.current == null || !fullscreenEnabled}
        onClick={enterFullscreen}
      />
    </Tooltip>
  );
};
