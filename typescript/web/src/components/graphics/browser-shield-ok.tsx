import * as React from "react";

function SvgBrowserShieldOk(
  props: React.SVGProps<SVGSVGElement>,
  svgRef?: React.Ref<SVGSVGElement>
) {
  return (
    <svg
      id="browser-shield-ok_svg__Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 96 96"
      ref={svgRef}
      {...props}
    >
      <defs>
        <style>
          {
            ".browser-shield-ok_svg__cls-5{fill:#ffd69e}.browser-shield-ok_svg__cls-7{fill:#85bd79}.browser-shield-ok_svg__cls-12{fill:#39426a}.browser-shield-ok_svg__cls-13{fill:#c3e1f5}"
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
        d="M73 44v16.75A36 36 0 0148 95a36 36 0 01-25-34.25V44l25-10z"
        fill="#fac77d"
      />
      <path
        className="browser-shield-ok_svg__cls-5"
        d="M73 44v11.75a36 36 0 01-23.5 33.73A36 36 0 0126 55.75V44l23.5-9.4z"
      />
      <path
        className="browser-shield-ok_svg__cls-5"
        d="M73 44v11.75a36 36 0 01-23.5 33.73A36 36 0 0126 55.75V44l23.5-9.4z"
      />
      <path
        d="M58.84 80.45a14.16 14.16 0 01-18.68 0A33.07 33.07 0 0129 55.75a14.35 14.35 0 019-13.33L44.17 40a14.34 14.34 0 0110.66 0L61 42.42a14.35 14.35 0 019 13.33 33.07 33.07 0 01-11.16 24.7z"
        fill="#ffe5c3"
      />
      <path
        className="browser-shield-ok_svg__cls-7"
        d="M62 51L43 70l-9-9-3 3 12 12 22-22-3-3z"
      />
      <path fill="#90d1d7" d="M1 1h94v12H1z" />
      <path d="M4 1h91v9H13a9 9 0 01-9-9z" fill="#abd9e6" />
      <circle cx={9} cy={7} r={2} fill="#cf4055" />
      <circle cx={19} cy={7} r={2} fill="#f6b756" />
      <circle className="browser-shield-ok_svg__cls-7" cx={29} cy={7} r={2} />
      <path
        className="browser-shield-ok_svg__cls-12"
        d="M9 4a3 3 0 103 3 3 3 0 00-3-3zm0 4a1 1 0 111-1 1 1 0 01-1 1zM19 4a3 3 0 103 3 3 3 0 00-3-3zm0 4a1 1 0 111-1 1 1 0 01-1 1zM29 4a3 3 0 103 3 3 3 0 00-3-3zm0 4a1 1 0 111-1 1 1 0 01-1 1z"
      />
      <rect
        className="browser-shield-ok_svg__cls-13"
        x={45}
        y={4}
        width={46}
        height={4}
        rx={2}
      />
      <circle className="browser-shield-ok_svg__cls-13" cx={40} cy={6} r={2} />
      <path
        className="browser-shield-ok_svg__cls-12"
        d="M95 0H1a1 1 0 00-1 1v80a1 1 0 001 1h27.69a36.85 36.85 0 0019 14 .93.93 0 00.6 0 36.85 36.85 0 0019-14H95a1 1 0 001-1V1a1 1 0 00-1-1zM2 2h92v10H2zm46 92a34.84 34.84 0 01-24-33.2V44.68l24-9.6 24 9.6v16.07A34.84 34.84 0 0148 94zm20.62-14A36.93 36.93 0 0074 60.75V44a1 1 0 00-.63-.93l-25-10a1 1 0 00-.74 0l-25 10A1 1 0 0022 44v16.75A36.93 36.93 0 0027.38 80H2V14h92v66z"
      />
      <path
        className="browser-shield-ok_svg__cls-12"
        d="M9 4a3 3 0 103 3 3 3 0 00-3-3zm0 4a1 1 0 111-1 1 1 0 01-1 1zM19 4a3 3 0 103 3 3 3 0 00-3-3zm0 4a1 1 0 111-1 1 1 0 01-1 1zM29 4a3 3 0 103 3 3 3 0 00-3-3zm0 4a1 1 0 111-1 1 1 0 01-1 1zM62.71 50.29a1 1 0 00-1.42 0L43 68.59l-8.29-8.3a1 1 0 00-1.42 0l-3 3a1 1 0 000 1.42l12 12a1 1 0 001.42 0l22-22a1 1 0 000-1.42zM43 74.59L32.41 64 34 62.41l8.29 8.3a1 1 0 001.42 0L62 52.41 63.59 54z"
      />
    </svg>
  );
}

const ForwardRef = React.forwardRef(SvgBrowserShieldOk);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
