import React, { RefObject } from "react";

import { FullScreenTool } from "./full-screen-tool";
import { ViewModeButton } from "./view-mode-button";
import { ZoomTool } from "./zoom-tool";

export const ViewToolbar = ({
  containerRef,
}: {
  containerRef: RefObject<HTMLDivElement>;
}) => {
  return (
    <>
      <ViewModeButton />
      <FullScreenTool containerRef={containerRef} />
      <ZoomTool />
    </>
  );
};
