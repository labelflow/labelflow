import * as React from "react";

function SvgBrowserLock(
  props: React.SVGProps<SVGSVGElement>,
  svgRef?: React.Ref<SVGSVGElement>
) {
  return (
    <svg
      id="browser-lock_svg__Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 96 96"
      ref={svgRef}
      {...props}
    >
      <defs>
        <style>
          {
            ".browser-lock_svg__cls-8{fill:#5c5f7d}.browser-lock_svg__cls-14{fill:#39426a}.browser-lock_svg__cls-15{fill:#c3e1f5}.browser-lock_svg__cls-16{fill:#f4bb79}"
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
        d="M66 45v10h-6V45a12 12 0 00-10.5-11.9A10.6 10.6 0 0048 33a12 12 0 00-12 12v10h-6V45a18 18 0 0118-18q.77 0 1.5.06A18 18 0 0166 45z"
        fill="#8288a1"
      />
      <path
        d="M66 45v7a3 3 0 01-3-3v-4a12 12 0 00-12-12 10.6 10.6 0 00-1.5.1 11.15 11.15 0 00-2-.09A12 12 0 0036 45v7a3 3 0 01-3-3v-4a18 18 0 0116.5-17.94A18 18 0 0166 45z"
        fill="#969cb2"
      />
      <rect x={24} y={55} width={48} height={40} rx={2} fill="#e69c4b" />
      <path
        d="M72 57v35H45a18.05 18.05 0 01-18-18V55h43a2 2 0 012 2z"
        fill="#ecaa63"
      />
      <path
        className="browser-lock_svg__cls-8"
        d="M45 73h6v8a3 3 0 01-3 3 3 3 0 01-3-3v-8z"
      />
      <circle className="browser-lock_svg__cls-8" cx={48} cy={71} r={5} />
      <path fill="#90d1d7" d="M1 1h94v12H1z" />
      <path d="M4 1h91v9H13a9 9 0 01-9-9z" fill="#abd9e6" />
      <circle cx={9} cy={7} r={2} fill="#cf4055" />
      <circle cx={19} cy={7} r={2} fill="#f6b756" />
      <circle cx={29} cy={7} r={2} fill="#85bd79" />
      <path
        className="browser-lock_svg__cls-14"
        d="M9 4a3 3 0 103 3 3 3 0 00-3-3zm0 4a1 1 0 111-1 1 1 0 01-1 1zM19 4a3 3 0 103 3 3 3 0 00-3-3zm0 4a1 1 0 111-1 1 1 0 01-1 1zM29 4a3 3 0 103 3 3 3 0 00-3-3zm0 4a1 1 0 111-1 1 1 0 01-1 1z"
      />
      <rect
        className="browser-lock_svg__cls-15"
        x={45}
        y={4}
        width={46}
        height={4}
        rx={2}
      />
      <circle className="browser-lock_svg__cls-15" cx={40} cy={6} r={2} />
      <path
        className="browser-lock_svg__cls-14"
        d="M95 0H1a1 1 0 00-1 1v80a1 1 0 001 1h22v11a3 3 0 003 3h44a3 3 0 003-3V82h22a1 1 0 001-1V1a1 1 0 00-1-1zM2 2h92v10H2zm69 91a1 1 0 01-1 1H26a1 1 0 01-1-1V57a1 1 0 011-1h44a1 1 0 011 1zm-6-39h-4v-9a13 13 0 00-26 0v9h-4v-9a17 17 0 0134 0zm-6 0H37v-9a11 11 0 0122 0zm14 26V57a3 3 0 00-3-3h-3v-9a19 19 0 00-38 0v9h-3a3 3 0 00-3 3v23H2V14h92v66z"
      />
      <path
        className="browser-lock_svg__cls-14"
        d="M9 4a3 3 0 103 3 3 3 0 00-3-3zm0 4a1 1 0 111-1 1 1 0 01-1 1zM19 4a3 3 0 103 3 3 3 0 00-3-3zm0 4a1 1 0 111-1 1 1 0 01-1 1zM29 4a3 3 0 103 3 3 3 0 00-3-3zm0 4a1 1 0 111-1 1 1 0 01-1 1zM48 65a6 6 0 00-6 6 5.93 5.93 0 002 4.45V81a4 4 0 008 0v-5.55A5.93 5.93 0 0054 71a6 6 0 00-6-6zm2.4 9.18a1 1 0 00-.4.8v6a2 2 0 01-4 0V75a1 1 0 00-.4-.8 4 4 0 114.8 0z"
      />
      <rect
        className="browser-lock_svg__cls-16"
        x={62}
        y={68}
        width={6}
        height={22}
        rx={3}
      />
      <circle className="browser-lock_svg__cls-16" cx={65} cy={62} r={3} />
    </svg>
  );
}

const ForwardRef = React.forwardRef(SvgBrowserLock);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
