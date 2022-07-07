import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

export const theme = extendTheme({
  styles: {
    global: (props: any) => ({
      body: {
        color: mode("gray.800", "gray.200")(props),
      },
    }),
  },
  textStyles: {},
  initialColorMode: "light",
  useSystemColorMode: true,
  colors: {
    gray: {
      "50": "#FEFEFE",
      "100": "#D8D8D8",
      "200": "#B2B2B2",
      "300": "#8C8C8C",
      "400": "#4D4D4D",
      "500": "#37373D",
      "600": "#333333",
      "700": "#2A2D2E",
      "800": "#252526",
      "900": "#1E1E1E",
    },
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

export const noneClassColor = "#E2E8F0";
