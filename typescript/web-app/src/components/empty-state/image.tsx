import { chakra, HTMLChakraProps } from "@chakra-ui/react";
import * as React from "react";

export const EmptyStateImage = React.forwardRef<
  SVGSVGElement,
  HTMLChakraProps<"svg"> & { iconColor?: string }
>(({ iconColor, ...rest }: { iconColor?: string }, ref) => {
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
        fill="#F3F7FF"
        fillRule="evenodd"
        d="M63 134h91c.515 0 1.017-.056 1.5-.161.483.105.985.161 1.5.161h52a7 7 0 100-14h-6a7 7 0 110-14h19a7 7 0 100-14h-22a7 7 0 100-14h-64a7 7 0 100-14H79a7 7 0 100 14H39a7 7 0 100 14h25a7 7 0 110 14H24a7 7 0 100 14h39a7 7 0 100 14zm163 0a7 7 0 100-14 7 7 0 000 14z"
        clipRule="evenodd"
      />
      <path
        fill="#fff"
        fillRule="evenodd"
        d="M86.278 139.123l-4.07.572a4 4 0 01-4.517-3.404L66.556 57.069a4 4 0 013.404-4.518l78.231-10.994a4 4 0 014.518 3.404l.957 6.808"
        clipRule="evenodd"
      />
      <path
        fill="#E8F0FE"
        fillRule="evenodd"
        d="M88.805 134.712l-3.696.526a3.619 3.619 0 01-4.096-3.085l-9.996-71.925a3.646 3.646 0 013.098-4.108l71.037-10.096a3.618 3.618 0 014.097 3.085l.859 6.18 9.205 66.599c.306 2.212-1.22 4.257-3.407 4.566-.024.003-.047.007-.071.009l-67.03 8.249z"
        clipRule="evenodd"
      />
      <path
        stroke="#75A4FE"
        strokeLinecap="round"
        strokeWidth="2.5"
        d="M86.278 139.123l-4.07.572a4 4 0 01-4.517-3.404L66.556 57.069a4 4 0 013.404-4.518l78.231-10.994a4 4 0 014.518 3.404l.957 6.808M154.5 56.38l.5 3.12"
      />
      <path
        fill="#fff"
        stroke="#75A4FE"
        strokeWidth="2.5"
        d="M102.844 58.04l78.567 8.259a2.75 2.75 0 012.448 3.022l-8.362 79.562a2.75 2.75 0 01-3.023 2.447l-78.567-8.258a2.749 2.749 0 01-2.447-3.022l8.362-79.562a2.75 2.75 0 013.022-2.447z"
      />
      <path
        fill="#fff"
        fillRule="evenodd"
        d="M106.693 69.255a3 3 0 013.297-2.67l62.655 6.585a3 3 0 012.67 3.297l-5.54 52.71a3 3 0 01-3.297 2.67l-62.655-6.586a3 3 0 01-2.67-3.297l5.54-52.71z"
        clipRule="evenodd"
      />
      <path
        fill="#E8F0FE"
        fillRule="evenodd"
        d="M109.741 109.878l9.797-6.608a4 4 0 015.168.594l7.173 7.723c.358.385.954.427 1.363.096l15.339-12.43a4.001 4.001 0 015.878.936l9.981 15.438 1.433 2.392-.686 8.124a1 1 0 01-1.107.91l-56.963-6.329a1 1 0 01-.885-1.085l.755-8.199 2.754-1.562z"
        clipRule="evenodd"
      />
      <path
        stroke="#75A4FE"
        strokeWidth="2.5"
        d="M109.86 67.828l62.654 6.585a1.75 1.75 0 011.558 1.923l-5.54 52.71a1.75 1.75 0 01-1.923 1.558l-62.655-6.586a1.75 1.75 0 01-1.558-1.923l5.54-52.71a1.75 1.75 0 011.924-1.557z"
      />
      <circle
        cx="122.032"
        cy="85.949"
        r="6"
        fill="#E8F0FE"
        stroke="#75A4FE"
        strokeWidth="2.5"
        transform="rotate(6 122.032 85.95)"
      />
      <path
        stroke="#75A4FE"
        strokeLinecap="round"
        strokeWidth="2.5"
        d="M107.729 111.425l11.809-8.155a4 4 0 015.168.594l7.173 7.723c.358.385.954.427 1.363.096l15.339-12.43a4 4 0 015.878.936l11.064 17.556"
      />
    </chakra.svg>
  );
});
