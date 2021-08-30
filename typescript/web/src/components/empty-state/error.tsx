import { forwardRef, memo } from "react";
import { chakra, HTMLChakraProps } from "@chakra-ui/react";

function SvgError(
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
            ".error_svg__cls-11{fill:#cf4055}.error_svg__cls-14{fill:#c3e1f5}.error_svg__cls-16{fill:#dee1e7}.error_svg__cls-17{fill:#39426a}"
          }
        </style>
      </defs>
      <path d="M33 90h30a5 5 0 015 5H28a5 5 0 015-5z" fill="#c6ccda" />
      <path
        fill="#8288a1"
        d="M60 90H36l1.44-5.28L39 77h18l.69 3 1.62 7 .69 3z"
      />
      <path d="M59.31 87H47a5.7 5.7 0 01-5.6-6.83V80h16.3z" fill="#969cb2" />
      <rect x={1} y={1} width={94} height={76} rx={6} fill="#b8c0ce" />
      <path d="M7 1h82a6 6 0 016 6v58H1V7a6 6 0 016-6z" fill="#5c5f7d" />
      <rect x={6} y={6} width={84} height={54} rx={2} fill="#89a3ce" />
      <path
        d="M90 8v46.05a2 2 0 01-2 2H26A16 16 0 0110 40V6h78a2 2 0 012 2z"
        fill="#a5b9db"
      />
      <path d="M13 21h74v32H45a32 32 0 01-32-32z" fill="#c3d2e7" />
      <path d="M90 8v10H6V8a2 2 0 012-2h80a2 2 0 012 2z" fill="#90d1d7" />
      <path d="M90 8v7H18a9 9 0 01-9-9h79a2 2 0 012 2z" fill="#abd9e6" />
      <circle className="error_svg__cls-11" cx={14} cy={12} r={2} />
      <circle cx={24} cy={12} r={2} fill="#f6b756" />
      <circle cx={34} cy={12} r={2} fill="#85bd79" />
      <rect
        className="error_svg__cls-14"
        x={50}
        y={9}
        width={37}
        height={4}
        rx={2}
      />
      <circle className="error_svg__cls-14" cx={45} cy={11} r={2} />
      <path d="M3 65h89v5a4 4 0 01-4 4H7a4 4 0 01-4-4v-5z" fill="#ccd1dc" />
      <rect
        className="error_svg__cls-16"
        x={14}
        y={68}
        width={76}
        height={4}
        rx={2}
      />
      <path
        className="error_svg__cls-17"
        d="M88 5H8a3 3 0 00-3 3v50a3 3 0 003 3h80a3 3 0 003-3V8a3 3 0 00-3-3zm1 53a1 1 0 01-1 1H8a1 1 0 01-1-1V8a1 1 0 011-1h80a1 1 0 011 1zM48 68a3 3 0 103 3 3 3 0 00-3-3zm0 4a1 1 0 111-1 1 1 0 01-1 1z"
      />
      <circle className="error_svg__cls-16" cx={8} cy={70} r={2} />
      <path
        className="error_svg__cls-17"
        d="M89 0H7a7 7 0 00-7 7v64a7 7 0 007 7h30.78l-1.31 6.46L35.24 89H33a6 6 0 00-6 6 1 1 0 001 1h40a1 1 0 001-1 6 6 0 00-6-6h-2.2l-2.54-11H89a7 7 0 007-7V7a7 7 0 00-7-7zM66.87 94H29.13A4 4 0 0133 91h30a4 4 0 013.87 3zm-8.13-5H37.31l1.11-4.08 1.4-6.92H56.2zM89 76H7a5 5 0 01-5-5v-5h92v5a5 5 0 01-5 5zm5-12H2V7a5 5 0 015-5h82a5 5 0 015 5z"
      />
      <path
        className="error_svg__cls-17"
        d="M88 5H8a3 3 0 00-3 3v50a3 3 0 003 3h80a3 3 0 003-3V8a3 3 0 00-3-3zM7 8a1 1 0 011-1h80a1 1 0 011 1v9H7zm81 51H8a1 1 0 01-1-1V19h82v39a1 1 0 01-1 1zM48 68a3 3 0 103 3 3 3 0 00-3-3zm0 4a1 1 0 111-1 1 1 0 01-1 1z"
      />
      <path
        className="error_svg__cls-17"
        d="M14 9a3 3 0 103 3 3 3 0 00-3-3zm0 4a1 1 0 111-1 1 1 0 01-1 1zM24 9a3 3 0 103 3 3 3 0 00-3-3zm0 4a1 1 0 111-1 1 1 0 01-1 1zM34 9a3 3 0 103 3 3 3 0 00-3-3zm0 4a1 1 0 111-1 1 1 0 01-1 1z"
      />
      <path
        className="error_svg__cls-11"
        d="M24 25a1 1 0 000-2h-8a1 1 0 00-1 1v12a1 1 0 001 1h8a1 1 0 000-2h-7v-4h5a1 1 0 000-2h-5v-4zM31 31h4a2 2 0 012 2v3a1 1 0 002 0v-3a4 4 0 00-1.38-3A4 4 0 0035 23h-5a1 1 0 00-1 1v12a1 1 0 002 0zm0-6h4a2 2 0 010 4h-4zM45 31h4a2 2 0 012 2v3a1 1 0 002 0v-3a4 4 0 00-1.38-3A4 4 0 0049 23h-5a1 1 0 00-1 1v12a1 1 0 002 0zm0-6h4a2 2 0 010 4h-4zM81 27a4 4 0 00-4-4h-5a1 1 0 00-1 1v12a1 1 0 002 0v-5h4a2 2 0 012 2v3a1 1 0 002 0v-3a4 4 0 00-1.38-3A4 4 0 0081 27zm-8 2v-4h4a2 2 0 010 4zM67 32v-4a5 5 0 00-10 0v4a5 5 0 0010 0zm-8 0v-4a3 3 0 016 0v4a3 3 0 01-6 0zM40 41a1 1 0 00-1 1v5h-4a2 2 0 01-2-2v-3a1 1 0 00-2 0v3a4 4 0 004 4h4v5a1 1 0 002 0V42a1 1 0 00-1-1zM68 41a1 1 0 00-1 1v5h-4a2 2 0 01-2-2v-3a1 1 0 00-2 0v3a4 4 0 004 4h4v5a1 1 0 002 0V42a1 1 0 00-1-1zM53.78 42.76A5 5 0 0045 46v4a5 5 0 001.1 3.09 1.58 1.58 0 00.12.15A5 5 0 0055 50v-4a5 5 0 00-1.1-3.09 1.58 1.58 0 00-.12-.15zM47 46a3 3 0 013-3 3 3 0 011.75.57l-4.69 7A3.08 3.08 0 0147 50zm6 4a3 3 0 01-3 3 3 3 0 01-1.75-.57l4.69-7A3.08 3.08 0 0153 46z"
      />
    </chakra.svg>
  );
}

const ForwardRef = forwardRef(SvgError);
export const EmptyStateError = memo(ForwardRef);

