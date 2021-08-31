import * as React from "react";

function SvgBrowserAlert(
  props: React.SVGProps<SVGSVGElement>,
  svgRef?: React.Ref<SVGSVGElement>
) {
  return (
    <svg
      id="browser-alert_svg__Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 96 96"
      ref={svgRef}
      {...props}
    >
      <defs>
        <style>
          {
            ".browser-alert_svg__cls-4{fill:#cf4055}.browser-alert_svg__cls-6{fill:#f6b756}.browser-alert_svg__cls-12{fill:#c3e1f5}.browser-alert_svg__cls-13{fill:#39426a}"
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
        className="browser-alert_svg__cls-4"
        d="M48 27a7.38 7.38 0 00-6.18 3.35L6 85.47a6.18 6.18 0 00-1 3.36A6.17 6.17 0 0011.17 95h73.66A6.17 6.17 0 0091 88.83a6.18 6.18 0 00-1-3.36L54.18 30.35A7.38 7.38 0 0048 27z"
      />
      <path
        d="M11.17 92A3.17 3.17 0 018 88.83a3.21 3.21 0 01.51-1.73L44.33 32a4.38 4.38 0 017.34 0l35.82 55.1a3.21 3.21 0 01.51 1.73A3.17 3.17 0 0184.83 92z"
        fill="#dc5d6b"
      />
      <path
        className="browser-alert_svg__cls-6"
        d="M85 88.74c0 .18 0 .26-.14.26H11.17a.18.18 0 01-.17-.17L12.84 86l34-52.38a1.38 1.38 0 012.3 0L83.19 86z"
      />
      <path
        d="M83.19 86H38.62a14 14 0 01-11.74-21.62l20-30.76a1.38 1.38 0 012.3 0z"
        fill="#fac77d"
      />
      <path
        d="M72.14 82a2 2 0 01-1.68-.91l-16.9-26a2 2 0 113.36-2.18l16.89 26A2 2 0 0172.14 82z"
        fill="#ffd69e"
      />
      <path className="browser-alert_svg__cls-4" d="M45 50h6v24h-6z" />
      <circle className="browser-alert_svg__cls-4" cx={48} cy={81} r={3} />
      <path fill="#90d1d7" d="M1 1h94v12H1z" />
      <path d="M4 1h91v9H13a9 9 0 01-9-9z" fill="#abd9e6" />
      <circle className="browser-alert_svg__cls-4" cx={9} cy={7} r={2} />
      <circle className="browser-alert_svg__cls-6" cx={19} cy={7} r={2} />
      <circle cx={29} cy={7} r={2} fill="#85bd79" />
      <rect
        className="browser-alert_svg__cls-12"
        x={45}
        y={4}
        width={46}
        height={4}
        rx={2}
      />
      <circle className="browser-alert_svg__cls-12" cx={40} cy={6} r={2} />
      <path
        className="browser-alert_svg__cls-13"
        d="M95 0H1a1 1 0 00-1 1v80a1 1 0 001 1h6.06l-1.9 2.92a7.17 7.17 0 006 11.08h73.67a7.17 7.17 0 006-11.08L88.94 82H95a1 1 0 001-1V1a1 1 0 00-1-1zM2 2h92v10H2zm88 86.83A5.18 5.18 0 0184.83 94H11.17a5.17 5.17 0 01-4.33-8l35.82-55.1a6.37 6.37 0 0110.68 0L89.16 86a5.15 5.15 0 01.84 2.83zM87.64 80L55 29.81a8.37 8.37 0 00-14 0L8.36 80H2V14h92v66z"
      />
      <path
        className="browser-alert_svg__cls-13"
        d="M9 4a3 3 0 103 3 3 3 0 00-3-3zm0 4a1 1 0 111-1 1 1 0 01-1 1zM19 4a3 3 0 103 3 3 3 0 00-3-3zm0 4a1 1 0 111-1 1 1 0 01-1 1zM29 4a3 3 0 103 3 3 3 0 00-3-3zm0 4a1 1 0 111-1 1 1 0 01-1 1zM48 32a2.35 2.35 0 00-2 1.08l-35.84 55.2a1.1 1.1 0 00-.16.55A1.18 1.18 0 0011.17 90h73.66a1.12 1.12 0 00.86-.39 1.25 1.25 0 00.27-1 1 1 0 00-.15-.4L50 33.08A2.35 2.35 0 0048 32zM12.73 88l35-53.83a.38.38 0 01.62 0L83.3 88z"
      />
      <path
        className="browser-alert_svg__cls-13"
        d="M44 50v24a1 1 0 001 1h6a1 1 0 001-1V50a1 1 0 00-1-1h-6a1 1 0 00-1 1zm2 1h4v22h-4zM48 77a4 4 0 104 4 4 4 0 00-4-4zm0 6a2 2 0 112-2 2 2 0 01-2 2z"
      />
    </svg>
  );
}

const ForwardRef = React.forwardRef(SvgBrowserAlert);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
