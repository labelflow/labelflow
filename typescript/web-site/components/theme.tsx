// 1. Import `extendTheme`
import { extendTheme } from "@chakra-ui/react";
// 2. Call `extendTheme` and pass your custom values
export const theme = extendTheme({
  initialColorMode: "light",
  useSystemColorMode: true,
  colors: {
    brand: {
      "50": "#EAFAFA",
      "100": "#C5F1F0",
      "200": "#A0E8E7",
      "300": "#7BDFDD",
      "400": "#56D7D4",
      "500": "#31CECA",
      "600": "#27A5A2",
      "700": "#1E7B79",
      "800": "#145251",
      "900": "#0A2928",
    },
  },
});
