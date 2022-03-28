import { FC, SVGAttributes } from "react";

declare global {
  type SvgComponent = FC<SVGAttributes<SVGElement>>;
}

// FIXME Make this code block actually override NextJS definitions.
//       Then, remove the cast being done after importing the app SVG files.
declare module "*.svg" {
  /**
   * NextJS overrides the type to use `any` and avoid conflicts with
   * `@svgr/webpack` plugin or `babel-plugin-inline-react-svg` plugin so we must
   * redeclare our own generic version
   */
  const content: SvgComponent;

  export default content;
}
