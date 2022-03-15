import React, { RefObject } from "react";

import { FullScreenTool } from "./full-screen-tool";
import { ViewModeTool } from "./view-mode-tool";
import { ZoomTool } from "./zoom-tool";

export const ViewToolbar = ({
  containerRef,
}: {
  containerRef: RefObject<HTMLDivElement>;
}) => {
  return (
    <>
      <ViewModeTool />
      <FullScreenTool containerRef={containerRef} />
      <ZoomTool />
    </>
  );
};
