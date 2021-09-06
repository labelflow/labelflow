import * as React from "react";

function SvgCreditCard(
  props: React.SVGProps<SVGSVGElement>,
  svgRef?: React.Ref<SVGSVGElement>
) {
  return (
    <svg
      viewBox="0 0 84 58"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      ref={svgRef}
      {...props}
    >
      <path
        d="M79.46.55H4.7A3.94 3.94 0 00.76 4.49v49.18a3.94 3.94 0 003.94 3.94h74.76a3.94 3.94 0 003.94-3.94V4.49A3.94 3.94 0 0079.46.55z"
        fill="#7190C4"
      />
      <path
        d="M83.4 4.49v49.19H8.63a3.93 3.93 0 01-3.93-3.94V.55h74.77a3.93 3.93 0 013.93 3.94z"
        fill="#89A3CE"
      />
      <path
        d="M8.63 3.5h69.85a2 2 0 012 2v44.24a1.999 1.999 0 01-2 2H52.9A46.239 46.239 0 016.66 5.47 2 2 0 018.63 3.5z"
        fill="#A5B9DB"
      />
      <path
        d="M56.84 23.18a6.89 6.89 0 100-13.78 6.89 6.89 0 000 13.78z"
        fill="#F69163"
      />
      <path
        d="M65.69 23.18a6.89 6.89 0 100-13.78 6.89 6.89 0 000 13.78z"
        fill="#CF4055"
      />
      <path d="M24.37 13.34H8.63v11.81h15.74V13.34z" fill="#E69C4B" />
      <path d="M19.45 13.34h-5.9v11.81h5.9V13.34z" fill="#DD8B37" />
      <path
        d="M13.55 17.28H9.61v3.94h3.94v-3.94zM23.39 17.28h-3.94v3.94h3.94v-3.94z"
        fill="#F6B756"
      />
      <path d="M16.5 17.28h-2.95v3.94h2.95v-3.94z" fill="#E69C4B" />
      <path
        d="M8.63 26.13h15.74a1 1 0 001-1V13.34a1 1 0 00-1-1H8.63a1 1 0 00-1 1v11.81a1 1 0 001 .98zm1-11.81h13.76v9.84H9.61l.02-9.84zM56.84 24.16a7.81 7.81 0 004.43-1.37 7.74 7.74 0 004.42 1.37 7.869 7.869 0 10-4.43-14.37 7.87 7.87 0 10-4.42 14.37zm14.76-7.87a5.91 5.91 0 11-11.821.02 5.91 5.91 0 0111.821-.02zm-14.76-5.9a5.82 5.82 0 012.9.77 7.83 7.83 0 000 10.27 5.9 5.9 0 11-2.9-11v-.04zM16.5 42.85H8.63a1 1 0 000 2h7.87a1 1 0 000-2zM30.27 42.85H22.4a1 1 0 000 2h7.87a1 1 0 000-2zM44.05 42.85h-7.87a1 1 0 000 2h7.87a1 1 0 000-2zM57.82 42.85H50a1 1 0 000 2h7.87a1 1 0 000-2h-.05z"
        fill="#39426A"
      />
      <rect
        x={1.25}
        y={1.25}
        width={81.5}
        height={55.5}
        rx={2.75}
        stroke="#39426A"
        strokeWidth={2.5}
      />
    </svg>
  );
}

const ForwardRef = React.forwardRef(SvgCreditCard);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
