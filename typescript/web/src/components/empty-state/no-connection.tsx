import { forwardRef, memo } from "react";
import { chakra, HTMLChakraProps } from "@chakra-ui/react";

function SvgNoConnection(
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
            ".no-connection_svg__cls-1{fill:#6a6e86}.no-connection_svg__cls-2{fill:#8288a1}.no-connection_svg__cls-3{fill:#969cb2}.no-connection_svg__cls-5{fill:#797c92}.no-connection_svg__cls-6{fill:#f6b756}.no-connection_svg__cls-7{fill:#aeb4c6}.no-connection_svg__cls-8{fill:#c6ccda}.no-connection_svg__cls-9{fill:#39426a}"
          }
        </style>
      </defs>
      <path
        className="no-connection_svg__cls-1"
        d="M6 90h14v5H6zM76 90h14v5H76z"
      />
      <path
        className="no-connection_svg__cls-2"
        d="M95 68v18a4.43 4.43 0 01-.1.9A4 4 0 0191 90H5a4 4 0 01-4-4V68a4 4 0 013.1-3.9A4.43 4.43 0 015 64h86a4 4 0 014 4z"
      />
      <path
        className="no-connection_svg__cls-3"
        d="M95 68v18a4.43 4.43 0 01-.1.9 4.43 4.43 0 01-.9.1H8a4 4 0 01-4-4V65a4.43 4.43 0 01.1-.9A4.43 4.43 0 015 64h86a4 4 0 014 4z"
      />
      <circle cx={13} cy={77} r={6} fill="#878c9f" />
      <circle className="no-connection_svg__cls-1" cx={13} cy={77} r={6} />
      <circle className="no-connection_svg__cls-5" cx={13} cy={77} r={3} />
      <circle className="no-connection_svg__cls-6" cx={30} cy={77} r={3} />
      <circle className="no-connection_svg__cls-6" cx={42} cy={77} r={3} />
      <circle className="no-connection_svg__cls-6" cx={54} cy={77} r={3} />
      <circle className="no-connection_svg__cls-6" cx={66} cy={77} r={3} />
      <circle className="no-connection_svg__cls-1" cx={83} cy={77} r={6} />
      <circle className="no-connection_svg__cls-5" cx={83} cy={77} r={3} />
      <rect
        className="no-connection_svg__cls-7"
        x={23}
        y={67}
        width={69}
        height={4}
        rx={2}
      />
      <path
        className="no-connection_svg__cls-3"
        d="M7 56h10v8H7zM79 56h10v8H79z"
      />
      <path
        className="no-connection_svg__cls-2"
        d="M7 60h10v4H7zM79 60h10v4H79z"
      />
      <path
        className="no-connection_svg__cls-8"
        d="M14 32V3a2 2 0 00-2-2 2 2 0 00-2 2v29L9 56h6zM86 32V3a2 2 0 00-2-2 2 2 0 00-2 2v29l-1 24h6z"
      />
      <circle className="no-connection_svg__cls-6" cx={48} cy={43} r={3} />
      <path
        className="no-connection_svg__cls-6"
        d="M58.61 32.39a15 15 0 00-21.22 0l4.25 4.25a9 9 0 0112.72 0z"
      />
      <path
        className="no-connection_svg__cls-6"
        d="M67.09 23.91a27 27 0 00-38.18 0l4.24 4.24a21 21 0 0129.7 0z"
      />
      <path
        className="no-connection_svg__cls-9"
        d="M91 63h-1v-7a1 1 0 00-1-1h-1l-1-23V3a3 3 0 00-6 0v29l-1 23h-1a1 1 0 00-1 1v7H18v-7a1 1 0 00-1-1h-1l-1-23V3a3 3 0 00-6 0v29L8 55H7a1 1 0 00-1 1v7H5a5 5 0 00-5 5v18a5 5 0 005 5v4a1 1 0 001 1h14a1 1 0 001-1v-4h54v4a1 1 0 001 1h14a1 1 0 001-1v-4a5 5 0 005-5V68a5 5 0 00-5-5zm-8-31V3a1 1 0 012 0v29l1 23h-4zm-3 25h8v6h-8zM11 32V3a1 1 0 012 0v29l1 23h-4zM8 57h8v6H8zm11 37H7v-3h12zm70 0H77v-3h12zm5-8a3 3 0 01-3 3H5a3 3 0 01-3-3V68a3 3 0 013-3h86a3 3 0 013 3z"
      />
      <path
        className="no-connection_svg__cls-9"
        d="M44 43a4 4 0 104-4 4 4 0 00-4 4zm6 0a2 2 0 11-2-2 2 2 0 012 2zM54.36 37.64a1 1 0 00.71-.3l4.24-4.24a1 1 0 000-1.41 16 16 0 00-22.62 0 1 1 0 000 1.41l4.24 4.24a1 1 0 001.41 0 8 8 0 0111.32 0 1 1 0 00.7.3zm-12.69-2.38l-2.84-2.84a14 14 0 0118.34 0l-2.84 2.84a10 10 0 00-12.66 0z"
      />
      <path
        className="no-connection_svg__cls-9"
        d="M32.44 28.86a1 1 0 001.42 0 20 20 0 0128.28 0 1 1 0 001.42 0l4.24-4.24a1 1 0 000-1.42 28 28 0 00-39.6 0 1 1 0 000 1.42zm33.22-4.94l-2.83 2.83a22 22 0 00-29.66 0l-2.83-2.83a26 26 0 0135.32 0zM13 70a7 7 0 107 7 7 7 0 00-7-7zm0 12a5 5 0 115-5 5 5 0 01-5 5zM83 70a7 7 0 107 7 7 7 0 00-7-7zm0 12a5 5 0 115-5 5 5 0 01-5 5zM30 73a4 4 0 104 4 4 4 0 00-4-4zm0 6a2 2 0 112-2 2 2 0 01-2 2zM42 73a4 4 0 104 4 4 4 0 00-4-4zm0 6a2 2 0 112-2 2 2 0 01-2 2zM54 73a4 4 0 104 4 4 4 0 00-4-4zm0 6a2 2 0 112-2 2 2 0 01-2 2zM66 73a4 4 0 104 4 4 4 0 00-4-4zm0 6a2 2 0 112-2 2 2 0 01-2 2z"
      />
      <circle className="no-connection_svg__cls-7" cx={18} cy={69} r={2} />
    </chakra.svg>
  );
}

const ForwardRef = forwardRef(SvgNoConnection);
export const EmptyStateNoConnection = memo(ForwardRef);
