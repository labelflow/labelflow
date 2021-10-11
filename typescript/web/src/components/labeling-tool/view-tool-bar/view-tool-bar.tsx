import React, { RefObject } from "react";

import { FullScreenTool } from "./full-screen-tool";
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
    </>
  );
};
