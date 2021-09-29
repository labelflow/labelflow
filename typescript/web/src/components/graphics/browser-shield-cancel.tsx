import * as React from "react";

function SvgBrowserShieldCancel(
  props: React.SVGProps<SVGSVGElement>,
  svgRef?: React.Ref<SVGSVGElement>
) {
  return (
    <svg
      id="browser-shield-cancel_svg__Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 96 96"
      ref={svgRef}
      {...props}
    >
      <defs>
        <style>
          {
            ".browser-shield-cancel_svg__cls-13{fill:#39426a}.browser-shield-cancel_svg__cls-14{fill:#c3e1f5}"
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
        d="M73 44v11.75a36 36 0 01-23.5 33.73A36 36 0 0126 55.75V44l23.5-9.4z"
        fill="#ffd69e"
      />
      <path
        d="M58.84 80.45a14.16 14.16 0 01-18.68 0A33.07 33.07 0 0129 55.75a14.35 14.35 0 019-13.33L44.17 40a14.34 14.34 0 0110.66 0L61 42.42a14.35 14.35 0 019 13.33 33.07 33.07 0 01-11.16 24.7z"
        fill="#ffe5c3"
      />
      <path
        fill="#dc5d6b"
        d="M62 53.5l-3-3-11 11-11-11-3 3 11 11-11 11 3 3 11-11 11 11 3-3-11-11 11-11z"
      />
      <path fill="#90d1d7" d="M1 1h94v12H1z" />
      <path d="M4 1h91v9H13a9 9 0 01-9-9z" fill="#abd9e6" />
      <circle cx={9} cy={7} r={2} fill="#cf4055" />
      <circle cx={19} cy={7} r={2} fill="#f6b756" />
      <circle cx={29} cy={7} r={2} fill="#85bd79" />
      <path
        className="browser-shield-cancel_svg__cls-13"
        d="M9 4a3 3 0 103 3 3 3 0 00-3-3zm0 4a1 1 0 111-1 1 1 0 01-1 1zM19 4a3 3 0 103 3 3 3 0 00-3-3zm0 4a1 1 0 111-1 1 1 0 01-1 1zM29 4a3 3 0 103 3 3 3 0 00-3-3zm0 4a1 1 0 111-1 1 1 0 01-1 1z"
      />
      <rect
        className="browser-shield-cancel_svg__cls-14"
        x={45}
        y={4}
        width={46}
        height={4}
        rx={2}
      />
      <circle
        className="browser-shield-cancel_svg__cls-14"
        cx={40}
        cy={6}
        r={2}
      />
      <path
        className="browser-shield-cancel_svg__cls-13"
        d="M95 0H1a1 1 0 00-1 1v80a1 1 0 001 1h27.69a36.85 36.85 0 0019 14 .93.93 0 00.6 0 36.85 36.85 0 0019-14H95a1 1 0 001-1V1a1 1 0 00-1-1zM2 2h92v10H2zm46 92a34.84 34.84 0 01-24-33.2V44.68l24-9.6 24 9.6v16.07A34.84 34.84 0 0148 94zm20.62-14A36.93 36.93 0 0074 60.75V44a1 1 0 00-.63-.93l-25-10a1 1 0 00-.74 0l-25 10A1 1 0 0022 44v16.75A36.93 36.93 0 0027.38 80H2V14h92v66z"
      />
      <path
        className="browser-shield-cancel_svg__cls-13"
        d="M9 4a3 3 0 103 3 3 3 0 00-3-3zm0 4a1 1 0 111-1 1 1 0 01-1 1zM19 4a3 3 0 103 3 3 3 0 00-3-3zm0 4a1 1 0 111-1 1 1 0 01-1 1zM29 4a3 3 0 103 3 3 3 0 00-3-3zm0 4a1 1 0 111-1 1 1 0 01-1 1zM62.71 52.79l-3-3a1 1 0 00-1.42 0L48 60.09l-10.29-10.3a1 1 0 00-1.42 0l-3 3a1 1 0 000 1.42l10.3 10.29-10.3 10.29a1 1 0 000 1.42l3 3a1 1 0 001.42 0L48 68.91l10.29 10.3a1 1 0 001.42 0l3-3a1 1 0 000-1.42L52.41 64.5l10.3-10.29a1 1 0 000-1.42zm-12.42 11a1 1 0 000 1.42l10.3 10.29L59 77.09l-10.29-10.3a1 1 0 00-1.42 0L37 77.09l-1.59-1.59 10.3-10.29a1 1 0 000-1.42L35.41 53.5 37 51.91l10.29 10.3a1 1 0 001.42 0L59 51.91l1.59 1.59z"
      />
    </svg>
  );
}

const ForwardRef = React.forwardRef(SvgBrowserShieldCancel);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
