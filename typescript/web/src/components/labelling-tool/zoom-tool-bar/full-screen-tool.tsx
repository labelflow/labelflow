import { RefObject, useState } from "react";
import {
  IconButton,
  chakra,
  Tooltip,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { RiFullscreenLine, RiFullscreenExitLine } from "react-icons/ri";

import { isInWindowScope } from "../../../utils/detect-scope";

const FullscreenIcon = chakra(RiFullscreenLine);
const FullscreenExitIcon = chakra(RiFullscreenExitLine);

// For Full screen related stuff,
// See https://github.com/openlayers/openlayers/blob/v6.7.0/src/ol/control/FullScreen.js

/**
 * @return {boolean} Fullscreen is supported by the current platform.
 */
function isFullScreenSupported() {
  if (!isInWindowScope) {
    // Assume it is supported for most users.
    return true;
  }
  const { body } = document;
  return !!(
    body.webkitRequestFullscreen ||
    (body.msRequestFullscreen && document.msFullscreenEnabled) ||
    (body.requestFullscreen && document.fullscreenEnabled)
  );
}

// /**
//  * @return {boolean} Element is currently in fullscreen.
//  */
// function isFullScreen() {
//   return !!(
//     document.webkitIsFullScreen ||
//     document.msFullscreenElement ||
//     document.fullscreenElement
//   );
// }

/**
 * Request to fullscreen an element.
 * @param {HTMLElement} element Element to request fullscreen
 */
function requestFullScreen(element: HTMLElement) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  }
}

/**
 * Request to fullscreen an element with keyboard input.
 * @param {HTMLElement} element Element to request fullscreen
 */
function requestFullScreenWithKeys(element: HTMLElement) {
  if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else {
    requestFullScreen(element);
  }
}

/**
 * Exit fullscreen.
 */
function exitFullScreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

export const FullScreenTool = ({
  containerRef,
}: {
  containerRef: RefObject<HTMLDivElement>;
}) => {
  const [isFullScreenState, setIsFullScreenState] = useState(false);
  const handleFullScreen = () => {
    if (containerRef.current) {
      setIsFullScreenState(true);
      requestFullScreenWithKeys(containerRef.current);
    }
  };
  const handleFullScreenExit = () => {
    setIsFullScreenState(false);
    exitFullScreen();
  };

  if (!isFullScreenSupported()) {
    return null;
  }
  if (isFullScreenState) {
    return (
      <Tooltip label="Exit Full Screen" placement="left" openDelay={300}>
        <IconButton
          icon={<FullscreenExitIcon fontSize="lg" />}
          backgroundColor={mode("white", "gray.800")}
          aria-label="Exit Full Screen"
          pointerEvents="initial"
          isDisabled={false}
          onClick={handleFullScreenExit}
        />
      </Tooltip>
    );
  }
  return (
    <Tooltip label="Full Screen" placement="left" openDelay={300}>
      <IconButton
        icon={<FullscreenIcon fontSize="lg" />}
        backgroundColor={mode("white", "gray.800")}
        aria-label="Full Screen"
        pointerEvents="initial"
        isDisabled={containerRef.current == null}
        onClick={handleFullScreen}
      />
    </Tooltip>
  );
};
