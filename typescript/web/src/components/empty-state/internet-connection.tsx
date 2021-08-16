/* eslint-disable @typescript-eslint/no-unused-vars */
import { chakra, useToken, HTMLChakraProps } from "@chakra-ui/react";
import * as React from "react";

export const EmptyStateInternetConnection = React.forwardRef<
  SVGSVGElement,
  HTMLChakraProps<"svg"> & { colorScheme?: string }
>(({ colorScheme, ...rest }: { colorScheme?: string }, ref) => {
  const [brand50, brand100, brand300, brand500] = useToken(
    "colors",
    ["brand.50", "brand.100", "brand.300", "brand.500"],
    "#ff00ff"
  );
  return (
    <chakra.svg
      width="250"
      height="200"
      fill="none"
      viewBox="0 0 250 200"
      {...rest}
      ref={ref}
    >
      <path
        fill={brand50}
        fillRule="evenodd"
        d="M56 127a7 7 0 007 7h146a7 7 0 100-14h-6a7 7 0 110-14h19a7 7 0 100-14h-22a7 7 0 100-14h-64a7 7 0 100-14H79a7 7 0 100 14H39a7 7 0 100 14h25a7 7 0 110 14H24a7 7 0 100 14h39a7 7 0 00-7 7zm170 7a7 7 0 100-14 7 7 0 000 14z"
        clipRule="evenodd"
      />
      <path
        fill="white"
        fillRule="evenodd"
        d="M92 140c-12.15 0-22-9.626-22-21.5S79.85 97 92 97c.517 0 1.03.017 1.537.052A34.205 34.205 0 0193 91c0-18.778 15.222-34 34-34 14.991 0 27.716 9.702 32.239 23.17A31.347 31.347 0 01162.5 80c16.845 0 30.5 13.431 30.5 30 0 15.741-12.325 28.727-28 29.978V140h-56.492m-4.512 0h-6.965 6.965z"
        clipRule="evenodd"
      />
      <path
        fill={brand500}
        d="M92 141.25a1.25 1.25 0 000-2.5v2.5zm1.537-44.198l-.084 1.247 1.597.108-.283-1.576-1.23.22zm65.702-16.883l-1.185.398.318.95.997-.104-.13-1.243zM165 139.978l-.099-1.246-1.151.092v1.154H165zm0 .022v1.25h1.25V140H165zm-56.492-1.25a1.25 1.25 0 100 2.5v-2.5zm-4.512 2.5a1.25 1.25 0 000-2.5v2.5zm-6.965-2.5a1.25 1.25 0 000 2.5v-2.5zm-5.031 0c-11.487 0-20.75-9.093-20.75-20.25h-2.5c0 12.591 10.437 22.75 23.25 22.75v-2.5zM71.25 118.5c0-11.157 9.263-20.25 20.75-20.25v-2.5c-12.813 0-23.25 10.159-23.25 22.75h2.5zM92 98.25c.489 0 .973.016 1.453.049l.168-2.495A24.111 24.111 0 0092 95.75v2.5zm2.767-1.42A32.949 32.949 0 0194.25 91h-2.5c0 2.14.19 4.236.557 6.273l2.46-.442zM94.25 91c0-18.087 14.663-32.75 32.75-32.75v-2.5c-19.468 0-35.25 15.782-35.25 35.25h2.5zM127 58.25c14.438 0 26.697 9.344 31.054 22.317l2.37-.795C155.735 65.81 142.544 55.75 127 55.75v2.5zm32.369 23.163a30.104 30.104 0 013.131-.163v-2.5c-1.145 0-2.277.06-3.391.176l.26 2.487zm3.131-.163c16.174 0 29.25 12.891 29.25 28.75h2.5c0-17.278-14.235-31.25-31.75-31.25v2.5zM191.75 110c0 15.07-11.805 27.532-26.849 28.732l.198 2.492c16.307-1.301 29.151-14.813 29.151-31.224h-2.5zm-28 29.978V140h2.5v-.022h-2.5zm1.25-1.228h-56.492v2.5H165v-2.5zm-61.004 0h-6.965v2.5h6.965v-2.5z"
      />
      <ellipse
        stroke={brand300}
        strokeLinecap="round"
        strokeWidth="2.5"
        rx="6.72"
        ry="6.647"
        transform="matrix(-1 0 0 1 143.72 75.647)"
      />
      <ellipse
        cx="115"
        cy="104.5"
        stroke={brand500}
        strokeLinecap="round"
        strokeWidth="2.5"
        rx="7"
        ry="3.5"
        transform="rotate(-180 115 104.5)"
      />
      <ellipse
        cx="144"
        cy="104.5"
        stroke={brand500}
        strokeLinecap="round"
        strokeWidth="2.5"
        rx="7"
        ry="3.5"
        transform="rotate(-180 144 104.5)"
      />
      <path
        stroke={brand500}
        strokeLinecap="round"
        strokeWidth="2.5"
        d="M122 120h14.5"
      />
      <path
        fill={brand500}
        fillRule="evenodd"
        d="M69.156 60.292H57.21v2.376h8.448l-9.152 11.088V76h12.87v-2.376h-9.372l9.152-11.242v-2.09zm13.412 15.284H73.88v1.728h6.144l-6.656 8.064V87h9.36v-1.728h-6.816l6.656-8.176v-1.52z"
        clipRule="evenodd"
      />
    </chakra.svg>
  );
});
