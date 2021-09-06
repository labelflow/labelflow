import * as React from "react";

function SvgBrowserBug(
  props: React.SVGProps<SVGSVGElement>,
  svgRef?: React.Ref<SVGSVGElement>
) {
  return (
    <svg
      id="browser-bug_svg__Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 96 96"
      ref={svgRef}
      {...props}
    >
      <defs>
        <style>
          {
            ".browser-bug_svg__cls-7{fill:#abd9e6}.browser-bug_svg__cls-8{fill:#c3e1f5}.browser-bug_svg__cls-9{fill:#cf4055}.browser-bug_svg__cls-15{fill:#39426a}"
          }
        </style>
      </defs>
      <path fill="#ccd1dc" d="M85 81h10V1H1v80h84z" />
      <path d="M94 72V1H4v59a18 18 0 0018 18h66a6 6 0 006-6z" fill="#dee1e7" />
      <path
        d="M11 17h76a3 3 0 013 3v51a3 3 0 01-3 3H62A54 54 0 018 20a3 3 0 013-3z"
        fill="#f3f4f5"
      />
      <path d="M52 68.68V91a4 4 0 01-4 4 4 4 0 01-4-4V68.68z" fill="#8288a1" />
      <path
        d="M52 68.68V91a4 4 0 01-.74 2.31H51a4 4 0 01-4-4V68.68z"
        fill="#969cb2"
      />
      <circle cx={48} cy={44} r={25} fill="#7190c4" />
      <circle className="browser-bug_svg__cls-7" cx={48} cy={44} r={20} />
      <path
        className="browser-bug_svg__cls-8"
        d="M63 46a2 2 0 01-2-2 13 13 0 00-13-13 2 2 0 010-4 17 17 0 0117 17 2 2 0 01-2 2zM48 61a17 17 0 01-17-17 2 2 0 014 0 13 13 0 0013 13 2 2 0 010 4z"
      />
      <path
        className="browser-bug_svg__cls-9"
        d="M54 45a11.65 11.65 0 01-1.55 6A5.36 5.36 0 0148 54c-3.31 0-6-4-6-9 0-4 1.7-7.31 4-8.51a4.18 4.18 0 012-.49c3.31 0 6 4 6 9z"
      />
      <path
        d="M54 45a11.65 11.65 0 01-1.55 6 4.18 4.18 0 01-2 .49c-3.31 0-6-4-6-9a11.65 11.65 0 011.55-6 4.18 4.18 0 012-.49c3.31 0 6 4 6 9z"
        fill="#dc5d6b"
      />
      <ellipse cx={50} cy={42} rx={3} ry={5} fill="#e47980" />
      <path fill="#90d1d7" d="M1 1h94v12H1z" />
      <path className="browser-bug_svg__cls-7" d="M4 1h91v9H13a9 9 0 01-9-9z" />
      <circle className="browser-bug_svg__cls-9" cx={9} cy={7} r={2} />
      <circle cx={19} cy={7} r={2} fill="#f6b756" />
      <circle cx={29} cy={7} r={2} fill="#85bd79" />
      <rect
        className="browser-bug_svg__cls-8"
        x={45}
        y={4}
        width={46}
        height={4}
        rx={2}
      />
      <circle className="browser-bug_svg__cls-8" cx={40} cy={6} r={2} />
      <path
        className="browser-bug_svg__cls-15"
        d="M48 23a21 21 0 1021 21 21 21 0 00-21-21zm0 40a19 19 0 1119-19 19 19 0 01-19 19z"
      />
      <path
        className="browser-bug_svg__cls-15"
        d="M55 44q0-.55-.12-1.11A5.39 5.39 0 0059 39.31a1 1 0 10-1.9-.62A3.39 3.39 0 0154.42 41a9.64 9.64 0 00-2.69-4.45 4 4 0 00-.9-4.21 1 1 0 00-1.42 1.42 2 2 0 01.59 1.63 5.17 5.17 0 00-3.94 0 2 2 0 01.56-1.68 1 1 0 00-1.42-1.42 4 4 0 00-.9 4.21 9.64 9.64 0 00-2.72 4.5A3.39 3.39 0 0139 38.69a1 1 0 00-1.9.62 5.39 5.39 0 004.1 3.59q-.07.56-.12 1.11a4.6 4.6 0 00-3.93 2.55 1 1 0 00.46 1.34 1 1 0 00.39.1 1 1 0 00.9-.56A2.58 2.58 0 0141 46a13.51 13.51 0 00.54 3A4 4 0 0038 53a1 1 0 002 0 2 2 0 012-2h.37c1.27 2.44 3.3 4 5.63 4s4.36-1.56 5.63-4H54a2 2 0 012 2 1 1 0 002 0 4 4 0 00-3.58-4 13.51 13.51 0 00.58-3 2.58 2.58 0 012.14 1.41A1 1 0 0058 48a1 1 0 00.44-.1 1 1 0 00.46-1.34A4.6 4.6 0 0055 44zm-6 8.82V43h2a1 1 0 000-2h-6a1 1 0 000 2h2v9.83c-2.25-.76-4-4-4-7.83 0-4.34 2.29-8 5-8s5 3.66 5 8c0 3.79-1.75 7.07-4 7.83z"
      />
      <path
        className="browser-bug_svg__cls-15"
        d="M95 0H1a1 1 0 00-1 1v80a1 1 0 001 1h42v9a5 5 0 0010 0v-9h42a1 1 0 001-1V1a1 1 0 00-1-1zM2 2h92v10H2zm46 66a24 24 0 1124-24 24 24 0 01-24 24zm3 23a3 3 0 11-6 0V69.82a25.09 25.09 0 006 0zm2-11V69.51a26 26 0 10-10 0V80H2V14h92v66z"
      />
      <path
        className="browser-bug_svg__cls-15"
        d="M9 4a3 3 0 103 3 3 3 0 00-3-3zm0 4a1 1 0 111-1 1 1 0 01-1 1zM19 4a3 3 0 103 3 3 3 0 00-3-3zm0 4a1 1 0 111-1 1 1 0 01-1 1zM29 4a3 3 0 103 3 3 3 0 00-3-3zm0 4a1 1 0 111-1 1 1 0 01-1 1z"
      />
    </svg>
  );
}

const ForwardRef = React.forwardRef(SvgBrowserBug);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
