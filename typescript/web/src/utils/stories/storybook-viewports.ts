// Reuse Cypress values to make sure that it's compliant with our minimal UX requirements
export const CYPRESS_SCREEN_WIDTH = 1000;
export const CYPRESS_SCREEN_HEIGHT = 660;

export const SMALL_CHROMATIC_VIEWPORT = 320;

export const MEDIUM_CHROMATIC_VIEWPORT = 500;

export const LARGE_CHROMATIC_VIEWPORT = 1800;

export const CHROMATIC_VIEWPORTS: number[] = [
  SMALL_CHROMATIC_VIEWPORT,
  MEDIUM_CHROMATIC_VIEWPORT,
  CYPRESS_SCREEN_WIDTH,
  LARGE_CHROMATIC_VIEWPORT,
];
