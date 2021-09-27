import { RefObject, useState, useLayoutEffect, useCallback } from "react";

import fscreen from "fscreen";
import {
  IconButton,
  chakra,
  Tooltip,
  useColorModeValue as mode,
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
  if (!isInWindowScope)
    return {
      fullscreenEnabled: true,
      fullscreenActive: false,
      enterFullscreen: noOp,
      exitFullscreen: noOp,
    };
  const [active, setActive] = useState(false);
  useLayoutEffect(() => {
    const handleChange = () => {
      setActive(fscreen.fullscreenElement === fullscreenRef.current);
    };
    fscreen.addEventListener("fullscreenchange", handleChange);
    return () => fscreen.removeEventListener("fullscreenchange", handleChange);
  }, []);
  const enterFullscreen = useCallback(async () => {
    if (fscreen.fullscreenElement) {
      await fscreen.exitFullscreen();
    }
    if (fullscreenRef.current) {
      fscreen.requestFullscreen(fullscreenRef.current);
    }
  }, []);
  const exitFullscreen = useCallback(async () => {
    if (fscreen.fullscreenElement === fullscreenRef.current) {
      fscreen.exitFullscreen();
    }
  }, []);
  return {
    fullscreenEnabled: fscreen.fullscreenEnabled,
    fullscreenActive: active,
    enterFullscreen,
    exitFullscreen,
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

  if (fullscreenActive) {
    return (
      <Tooltip
        label={`Exit Full Screen [${keymap.enterFullScreen.key}]`}
        placement="left"
        openDelay={300}
      >
        <IconButton
          icon={<FullscreenExitIcon fontSize="lg" />}
          backgroundColor={mode("white", "gray.800")}
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
        backgroundColor={mode("white", "gray.800")}
        aria-label="Enter Full Screen"
        pointerEvents="initial"
        isDisabled={containerRef.current == null || !fullscreenEnabled}
        onClick={enterFullscreen}
      />
    </Tooltip>
  );
};
