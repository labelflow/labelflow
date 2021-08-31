import * as React from "react";

function SvgBrowserCancel(
  props: React.SVGProps<SVGSVGElement>,
  svgRef?: React.Ref<SVGSVGElement>
) {
  return (
    <svg
      id="browser-cancel_svg__Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 96 96"
      ref={svgRef}
      {...props}
    >
      <defs>
        <style>
          {
            ".browser-cancel_svg__cls-10{fill:#39426a}.browser-cancel_svg__cls-11{fill:#c3e1f5}"
          }
        </style>
      </defs>
      <path fill="#ccd1dc" d="M85 81h10V1H1v80h84z" />
      <path d="M94 72V1H4v59a18 18 0 0018 18h66a6 6 0 006-6z" fill="#dee1e7" />
      <path
        d="M11 17h76a3 3 0 013 3v51a3 3 0 01-3 3H62A54 54 0 018 20a3 3 0 013-3z"
        fill="#f3f4f5"
      />
      <path
        d="M48 37a29 29 0 1029 29 29 29 0 00-29-29zM25 66a23 23 0 0137-18.24L29.76 80A22.9 22.9 0 0125 66zm23 23a22.9 22.9 0 01-14-4.76L66.24 52A23 23 0 0148 89z"
        fill="#dc5d6b"
      />
      <path fill="#90d1d7" d="M1 1h94v12H1z" />
      <path d="M4 1h91v9H13a9 9 0 01-9-9z" fill="#abd9e6" />
      <circle cx={9} cy={7} r={2} fill="#cf4055" />
      <circle cx={19} cy={7} r={2} fill="#f6b756" />
      <circle cx={29} cy={7} r={2} fill="#85bd79" />
      <path
        className="browser-cancel_svg__cls-10"
        d="M9 4a3 3 0 103 3 3 3 0 00-3-3zm0 4a1 1 0 111-1 1 1 0 01-1 1zM19 4a3 3 0 103 3 3 3 0 00-3-3zm0 4a1 1 0 111-1 1 1 0 01-1 1zM29 4a3 3 0 103 3 3 3 0 00-3-3zm0 4a1 1 0 111-1 1 1 0 01-1 1z"
      />
      <rect
        className="browser-cancel_svg__cls-11"
        x={45}
        y={4}
        width={46}
        height={4}
        rx={2}
      />
      <circle className="browser-cancel_svg__cls-11" cx={40} cy={6} r={2} />
      <path
        className="browser-cancel_svg__cls-10"
        d="M95 0H1a1 1 0 00-1 1v80a1 1 0 001 1h21.64a30 30 0 0050.72 0H95a1 1 0 001-1V1a1 1 0 00-1-1zM2 2h92v10H2zm46 92a28 28 0 1128-28 28 28 0 01-28 28zm26.52-14a30 30 0 10-53 0H2V14h92v66z"
      />
      <path
        className="browser-cancel_svg__cls-10"
        d="M9 4a3 3 0 103 3 3 3 0 00-3-3zm0 4a1 1 0 111-1 1 1 0 01-1 1zM19 4a3 3 0 103 3 3 3 0 00-3-3zm0 4a1 1 0 111-1 1 1 0 01-1 1zM29 4a3 3 0 103 3 3 3 0 00-3-3zm0 4a1 1 0 111-1 1 1 0 01-1 1zM63 47.69a1 1 0 00-.39-.72A23.78 23.78 0 0048 42a24 24 0 00-24 24 23.78 23.78 0 005 14.61 1 1 0 00.72.39h.07a1 1 0 00.71-.29l32.21-32.24a1 1 0 00.29-.78zM29.88 78.47A21.8 21.8 0 0126 66a22 22 0 0122-22 21.8 21.8 0 0112.47 3.88zM67 51.39a1 1 0 00-.72-.39 1 1 0 00-.78.29l-29 29-3.24 3.24a1 1 0 00-.29.78 1 1 0 00.39.72 24 24 0 0032.73-3.32A23.93 23.93 0 0067 51.39zm-.91 2.14A22 22 0 0165 80H39.65zM35.53 84.12L37.65 82h25.43a22 22 0 01-27.55 2.12z"
      />
    </svg>
  );
}

const ForwardRef = React.forwardRef(SvgBrowserCancel);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
