import * as React from "react";

function SvgBrowserKey(
  props: React.SVGProps<SVGSVGElement>,
  svgRef?: React.Ref<SVGSVGElement>
) {
  return (
    <svg
      id="browser-key_svg__Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 96 96"
      ref={svgRef}
      {...props}
    >
      <defs>
        <style>
          {
            ".browser-key_svg__cls-4{fill:#f6b756}.browser-key_svg__cls-9{fill:#c3e1f5}.browser-key_svg__cls-10{fill:#39426a}"
          }
        </style>
      </defs>
      <path fill="#ccd1dc" d="M85 88h10V8H1v80h84z" />
      <path d="M94 79V8H4v59a18 18 0 0018 18h66a6 6 0 006-6z" fill="#dee1e7" />
      <path
        d="M11 24h76a3 3 0 013 3v51a3 3 0 01-3 3H62A54 54 0 018 27a3 3 0 013-3z"
        fill="#f3f4f5"
      />
      <path
        className="browser-key_svg__cls-4"
        d="M67 40a12 12 0 00-11.61 9H17v14h6v-8h6v8h6v-8h20.39A12 12 0 1067 40zm0 18a6 6 0 116-6 6 6 0 01-6 6z"
      />
      <path fill="#90d1d7" d="M1 8h94v12H1z" />
      <path d="M4 8h91v9H13a9 9 0 01-9-9z" fill="#abd9e6" />
      <circle cx={9} cy={14} r={2} fill="#cf4055" />
      <circle className="browser-key_svg__cls-4" cx={19} cy={14} r={2} />
      <circle cx={29} cy={14} r={2} fill="#85bd79" />
      <rect
        className="browser-key_svg__cls-9"
        x={45}
        y={11}
        width={46}
        height={4}
        rx={2}
      />
      <circle className="browser-key_svg__cls-9" cx={40} cy={13} r={2} />
      <path
        className="browser-key_svg__cls-10"
        d="M95 7H1a1 1 0 00-1 1v80a1 1 0 001 1h94a1 1 0 001-1V8a1 1 0 00-1-1zM2 9h92v10H2zm0 78V21h92v66z"
      />
      <path
        className="browser-key_svg__cls-10"
        d="M9 11a3 3 0 103 3 3 3 0 00-3-3zm0 4a1 1 0 111-1 1 1 0 01-1 1zM19 11a3 3 0 103 3 3 3 0 00-3-3zm0 4a1 1 0 111-1 1 1 0 01-1 1zM29 11a3 3 0 103 3 3 3 0 00-3-3zm0 4a1 1 0 111-1 1 1 0 01-1 1zM67 45a7 7 0 107 7 7 7 0 00-7-7zm0 12a5 5 0 115-5 5 5 0 01-5 5z"
      />
      <path
        className="browser-key_svg__cls-10"
        d="M67 39a13 13 0 00-12.36 9H17a1 1 0 00-1 1v14a1 1 0 001 1h6a1 1 0 001-1v-7h4v7a1 1 0 001 1h6a1 1 0 001-1v-7h18.64A13 13 0 1067 39zm0 24a11 11 0 01-10.64-8.25 1 1 0 00-1-.75H35a1 1 0 00-1 1v7h-4v-7a1 1 0 00-1-1h-6a1 1 0 00-1 1v7h-4V50h37.39a1 1 0 001-.75A11 11 0 1167 63z"
      />
    </svg>
  );
}

const ForwardRef = React.forwardRef(SvgBrowserKey);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
