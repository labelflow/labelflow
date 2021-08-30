import { forwardRef, memo } from "react";
import { chakra, HTMLChakraProps } from "@chakra-ui/react";

function SvgNoSearchResult(
  props: HTMLChakraProps<"svg">,
  svgRef?: React.Ref<SVGSVGElement>
) {
  return (
    <chakra.svg
      width="250"
      height="200"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 96 96"
      ref={svgRef}
      {...props}
    >
      <defs>
        <style>
          {
            ".no-search-results_svg__cls-10{fill:#c3e1f5}.no-search-results_svg__cls-11{fill:#39426a}"
          }
        </style>
      </defs>
      <path
        d="M68.65 76.64a4.29 4.29 0 01-.82 1.19 4 4 0 01-5.66 0L46.63 62.28l2-2 3.65-3.66 15.55 15.55a4 4 0 01.82 4.47z"
        fill="#5c5f7d"
      />
      <path
        d="M68.65 76.64A4.3 4.3 0 0167 77a4.07 4.07 0 01-2.83-1.17L52.28 63.94a5.18 5.18 0 010-7.32l15.55 15.55a4 4 0 01.82 4.47z"
        fill="#6a6e86"
      />
      <path fill="#ccd1dc" d="M9.09 32H1v20h94V32H9.09z" />
      <path
        d="M11.83 32H4v9.17A7.84 7.84 0 0011.83 49h75.34A7.84 7.84 0 0095 41.17V32H11.83z"
        fill="#dee1e7"
      />
      <path
        d="M54 36h33.5a3.5 3.5 0 013.5 3.5 3.5 3.5 0 01-3.5 3.5H54v-7z"
        fill="#f3f4f5"
      />
      <circle cx={32} cy={42} r={25} fill="#aeb4c6" />
      <circle cx={32} cy={42} r={23} fill="#969cb2" />
      <circle cx={32} cy={42} r={20} fill="#90d1d7" />
      <circle cx={32} cy={42} r={17} fill="#abd9e6" />
      <path
        className="no-search-results_svg__cls-10"
        d="M45 43a1 1 0 01-1-1 12 12 0 00-12-12 1 1 0 010-2 14 14 0 0114 14 1 1 0 01-1 1zM32 56a14 14 0 01-14-14 1 1 0 012 0 12 12 0 0012 12 1 1 0 010 2z"
      />
      <path
        className="no-search-results_svg__cls-11"
        d="M95 31H55.57a26 26 0 00-47.14 0H1a1 1 0 00-1 1v20a1 1 0 001 1h7.43a26 26 0 0038.08 10.58l15 15a5 5 0 007.07-7.08l-15-14.95a25.33 25.33 0 002-3.51H95a1 1 0 001-1V32a1 1 0 00-1-1zM2 51V33h5.6a26.11 26.11 0 000 18zm13 8a23.87 23.87 0 01-5-7.32v-.08a24.12 24.12 0 010-19.14v-.08a24 24 0 0144 0v.08a24.12 24.12 0 010 19.14v.08A24 24 0 0115 59zm52.12 13.88a3 3 0 010 4.24A3.08 3.08 0 0165 78a3 3 0 01-2.13-.88L48.14 62.38a26.57 26.57 0 004.24-4.24zM94 51H56.4a26.11 26.11 0 000-18H94z"
      />
      <path
        className="no-search-results_svg__cls-11"
        d="M48.92 54.38a20.82 20.82 0 000-24.76.88.88 0 00-.27-.36 20.91 20.91 0 00-33.3 0 .88.88 0 00-.27.36 20.82 20.82 0 000 24.76.88.88 0 00.27.36 20.91 20.91 0 0033.3 0 .88.88 0 00.27-.36zM32 23a19 19 0 0113.82 6H18.18A19 19 0 0132 23zm-15.46 8h30.92a18.86 18.86 0 010 22H16.54a18.86 18.86 0 010-22zM32 61a19 19 0 01-13.82-6h27.64A19 19 0 0132 61z"
      />
      <path
        className="no-search-results_svg__cls-11"
        d="M29 46.24a1 1 0 00.9.76 1 1 0 001-.63l1.1-2.68 1.07 2.68A1 1 0 0034 47h.07a1 1 0 00.9-.76l2-8a1 1 0 00-1.97-.48l-1.25 5-.85-2.13a1 1 0 00-1.86 0l-.85 2.13-1.25-5a1 1 0 10-1.94.48zM41 46.24a1 1 0 001.9.13l1.1-2.68 1.07 2.68A1 1 0 0046 47h.07a1 1 0 00.9-.76l2-8a1 1 0 00-1.97-.48l-1.25 5-.85-2.13a1 1 0 00-1.86 0l-.85 2.13-1.25-5a1 1 0 10-1.94.48zM17 46.24a1 1 0 001.9.13l1.1-2.68 1.07 2.68A1 1 0 0022 47h.07a1 1 0 00.9-.76l2-8a1 1 0 00-1.97-.48l-1.25 5-.85-2.13a1 1 0 00-1.86 0l-.85 2.13-1.25-5a1 1 0 00-1.94.48z"
      />
    </chakra.svg>
  );
}

const ForwardRef = forwardRef(SvgNoSearchResult);
export const EmptyStateNoSearchResult = memo(ForwardRef);
