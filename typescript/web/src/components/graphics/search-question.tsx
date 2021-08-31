import * as React from "react";

function SvgSearchQuestion(
  props: React.SVGProps<SVGSVGElement>,
  svgRef?: React.Ref<SVGSVGElement>
) {
  return (
    <svg
      id="search-question_svg__Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 96 96"
      ref={svgRef}
      {...props}
    >
      <defs>
        <style>
          {
            ".search-question_svg__cls-5{fill:#c3e1f5}.search-question_svg__cls-9{fill:#cf4055}.search-question_svg__cls-10{fill:#39426a}"
          }
        </style>
      </defs>
      <circle cx={36} cy={36} r={35} fill="#8288a1" />
      <circle cx={36} cy={36} r={31} fill="#969cb2" />
      <circle cx={36} cy={36} r={28} fill="#90d1d7" />
      <circle cx={36} cy={36} r={23} fill="#abd9e6" />
      <path
        className="search-question_svg__cls-5"
        d="M53 38a2 2 0 01-2-2 15 15 0 00-15-15 2 2 0 010-4 19 19 0 0119 19 2 2 0 01-2 2zM36 55a19 19 0 01-19-19 2 2 0 014 0 15 15 0 0015 15 2 2 0 010 4z"
      />
      <path
        transform="rotate(-45 62.84 62.841)"
        fill="#5c5f7d"
        d="M60.01 59.77h5.66v6.12h-5.66z"
      />
      <path
        d="M95 90a4.95 4.95 0 01-8.45 3.5l-25-25 7-7 25 25A5 5 0 0195 90z"
        fill="#7190c4"
      />
      <path
        d="M95 90a4.51 4.51 0 01-.45.53 4.95 4.95 0 01-7 0l-24-24 5-5 25 25A5 5 0 0195 90z"
        fill="#89a3ce"
      />
      <circle className="search-question_svg__cls-9" cx={36} cy={55} r={2} />
      <path
        className="search-question_svg__cls-9"
        d="M36.34 15H36a11.94 11.94 0 00-8.66 3.69A12.46 12.46 0 0024 27.35V28a2 2 0 002 2 2 2 0 002-2v-.73a8.38 8.38 0 012-5.59A8 8 0 0136 19h.07a7.86 7.86 0 017.49 5.28 8 8 0 01-3.28 9.48 13.06 13.06 0 00-6.28 11V47a2 2 0 002 2 2 2 0 002-2v-2.27a9.07 9.07 0 014.42-7.59A12 12 0 0036.34 15z"
      />
      <path
        className="search-question_svg__cls-10"
        d="M36 8a28 28 0 1028 28A28 28 0 0036 8zm0 54a26 26 0 1126-26 26 26 0 01-26 26z"
      />
      <path
        className="search-question_svg__cls-10"
        d="M94.26 85.84L69.21 60.79a1 1 0 00-1.42 0l-.79.8-3-3A36.06 36.06 0 1058.59 64l3 3-.8.79a1 1 0 000 1.42l25.05 25.05a6 6 0 008.42-8.42zM2 36a34 34 0 1134 34A34 34 0 012 36zm58.12 26.7q1.35-1.23 2.58-2.58L65.59 63 63 65.59zM90.05 94a3.9 3.9 0 01-2.79-1.16L62.91 68.5l.8-.79 4-4 .79-.8 24.34 24.35A3.9 3.9 0 0194 90.05 4 4 0 0190.05 94z"
      />
      <path
        className="search-question_svg__cls-10"
        d="M36 58a3 3 0 113-3 3 3 0 01-3 3zm0-4a1 1 0 101 1 1 1 0 00-1-1zM36 50a3 3 0 01-3-3v-2.27a14 14 0 016.74-11.81 7.08 7.08 0 002.87-8.33A6.83 6.83 0 0036.07 20a7 7 0 00-5.3 2.35A7.32 7.32 0 0029 27.27V28a3 3 0 01-6 0v-.65A13.39 13.39 0 0126.62 18 12.9 12.9 0 0136 14h.37A13 13 0 0143 38a8.08 8.08 0 00-4 6.74V47a3 3 0 01-3 3zm0-32a8.87 8.87 0 018.51 6 9 9 0 01-3.7 10.64A12 12 0 0035 44.73V47a1 1 0 002 0v-2.27a10.07 10.07 0 014.88-8.43A11 11 0 0036.31 16H36a10.93 10.93 0 00-7.94 3.38 11.43 11.43 0 00-3.06 8V28a1 1 0 002 0v-.73A9.31 9.31 0 0129.28 21 8.87 8.87 0 0136 18z"
      />
    </svg>
  );
}

const ForwardRef = React.forwardRef(SvgSearchQuestion);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
