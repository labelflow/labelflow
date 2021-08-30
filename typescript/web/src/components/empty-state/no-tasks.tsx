import { forwardRef, memo } from "react";
import { chakra, HTMLChakraProps } from "@chakra-ui/react";

function SvgNoTasks(
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
            ".no-tasks_svg__cls-1{fill:#dee1e7}.no-tasks_svg__cls-2{fill:#b8c0ce}"
          }
        </style>
      </defs>
      <path
        className="no-tasks_svg__cls-1"
        d="M75 90H21L4 88.3A3.32 3.32 0 011 85h94a3.32 3.32 0 01-3 3.3z"
      />
      <path className="no-tasks_svg__cls-2" d="M73 95H23l-2-5h54l-2 5z" />
      <path
        d="M76 49v24a12 12 0 01-12 12H32a12 12 0 01-12-12V49z"
        fill="#ccd1dc"
      />
      <path
        className="no-tasks_svg__cls-1"
        d="M76 49v24a11.88 11.88 0 01-2.15 6.85A11.88 11.88 0 0167 82H35a12 12 0 01-12-12V49z"
      />
      <path
        className="no-tasks_svg__cls-2"
        d="M75.62 76H83a7 7 0 007-7v-8a7 7 0 00-7-7h-7v4h6a4 4 0 014 4v6a4 4 0 01-4 4h-6"
      />
      <path
        d="M95 84H71a13 13 0 005.38-7H83a8 8 0 008-8v-8a8 8 0 00-8-8h-6v-4a1 1 0 00-1-1H20a1 1 0 00-1 1v24a13 13 0 006 11H1a1 1 0 00-1 1 4.33 4.33 0 003.91 4.32L20.28 91l1.77 4.42A1 1 0 0023 96h50a1 1 0 001-.65L75.72 91l16.4-1.64A4.33 4.33 0 0096 85a1 1 0 00-1-1zM77 59h5a3 3 0 013 3v6a3 3 0 01-3 3h-5zm6-4a6 6 0 016 6v8a6 6 0 01-6 6h-6.14a12.39 12.39 0 00.14-2h5a5 5 0 005-5v-6a5 5 0 00-5-5h-5v-2zM21 73V50h54v23a11 11 0 01-11 11H32a11 11 0 01-11-11zm51.31 21H23.69l-1.17-3h51zm19.6-6.69L75 89H21.05l-17-1.69A2.28 2.28 0 012.27 86h91.46a2.28 2.28 0 01-1.82 1.28z"
        fill="#39426a"
      />
      <path
        className="no-tasks_svg__cls-2"
        d="M48.42 30a1 1 0 01-.65-1.82c3.87-3.19 2.12-5.88-1.31-10.36-3.65-4.77-8.2-10.72.47-17.74a1 1 0 011.44.15 1 1 0 01-.15 1.45c-7.11 5.76-3.87 10-.13 14.89 3.08 4 6.58 8.6 1 13.19a1 1 0 01-.67.24zM29.43 43a1 1 0 01-.65-1.83c7.11-5.76 3.87-10 .13-14.9-3.08-4-6.58-8.59-1-13.18a1 1 0 011.3 1.58c-3.87 3.18-2.12 5.87 1.31 10.36 3.65 4.77 8.2 10.72-.47 17.74a1 1 0 01-.62.23zM65.43 39a1 1 0 01-.65-1.83c7.11-5.76 3.87-10 .13-14.9-3.08-4-6.58-8.59-1-13.18a1 1 0 111.3 1.58c-3.87 3.18-2.12 5.87 1.31 10.36 3.65 4.77 8.2 10.72-.47 17.74a1 1 0 01-.62.23z"
      />
      <path
        d="M51 52h19a3 3 0 013 3v17a8 8 0 01-8 8h-9a8 8 0 01-8-8V55a3 3 0 013-3z"
        fill="#f3f4f5"
      />
    </chakra.svg>
  );
}

const ForwardRef = forwardRef(SvgNoTasks);
export const EmptyStateNoTasks = memo(ForwardRef);
