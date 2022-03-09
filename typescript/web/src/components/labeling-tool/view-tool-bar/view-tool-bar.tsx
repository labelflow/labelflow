import React, { RefObject } from "react";

import { FullScreenTool } from "./full-screen-tool";
import { HideTool } from "./hide-tool";
import { ZoomTool } from "./zoom-tool";

export const ViewToolbar = ({
  containerRef,
}: {
  containerRef: RefObject<HTMLDivElement>;
}) => {
  return (
    <>
      <FullScreenTool containerRef={containerRef} />
      <ZoomTool />
      <HideTool />
    </>
  );
};
