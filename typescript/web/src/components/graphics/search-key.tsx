import * as React from "react";

function SvgSearchKey(
  props: React.SVGProps<SVGSVGElement>,
  svgRef?: React.Ref<SVGSVGElement>
) {
  return (
    <svg
      id="search-key_svg__Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 96 96"
      ref={svgRef}
      {...props}
    >
      <defs>
        <style>
          {
            ".search-key_svg__cls-8{fill:#c3e1f5}.search-key_svg__cls-10{fill:#39426a}"
          }
        </style>
      </defs>
      <circle cx={36} cy={36} r={35} fill="#8288a1" />
      <circle cx={36} cy={36} r={31} fill="#969cb2" />
      <circle cx={36} cy={36} r={28} fill="#90d1d7" />
      <circle cx={36} cy={36} r={23} fill="#abd9e6" />
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
      <path
        className="search-key_svg__cls-8"
        d="M36 55a19 19 0 01-19-19 2 2 0 014 0 15 15 0 0015 15 2 2 0 010 4zM53 38a2 2 0 01-2-2 15 15 0 00-15-15 2 2 0 010-4 19 19 0 0119 19 2 2 0 01-2 2z"
      />
      <path
        d="M38 41.29V17h-9v4h5v4h-5v4h5v12.29a7 7 0 104 0zM36 51a3 3 0 113-3 3 3 0 01-3 3z"
        fill="#f6b756"
      />
      <path
        className="search-key_svg__cls-10"
        d="M36 8a28 28 0 1028 28A28 28 0 0036 8zm0 54a26 26 0 1126-26 26 26 0 01-26 26z"
      />
      <path
        className="search-key_svg__cls-10"
        d="M94.26 85.84L69.21 60.79a1 1 0 00-1.42 0l-.79.8-3-3A36.06 36.06 0 1058.59 64l3 3-.8.79a1 1 0 000 1.42l25.05 25.05a6 6 0 008.42-8.42zM2 36a34 34 0 1134 34A34 34 0 012 36zm58.12 26.7q1.35-1.23 2.58-2.58L65.59 63 63 65.59zM90.05 94a3.9 3.9 0 01-2.79-1.16L62.91 68.5l.8-.79 4-4 .79-.8 24.34 24.35A3.9 3.9 0 0194 90.05 4 4 0 0190.05 94z"
      />
      <path
        className="search-key_svg__cls-10"
        d="M36 44a4 4 0 104 4 4 4 0 00-4-4zm0 6a2 2 0 112-2 2 2 0 01-2 2z"
      />
      <path
        className="search-key_svg__cls-10"
        d="M39 40.59V17a1 1 0 00-1-1h-9a1 1 0 00-1 1v4a1 1 0 001 1h4v2h-4a1 1 0 00-1 1v4a1 1 0 001 1h4v10.59a8 8 0 106 0zM36 54a6 6 0 01-1.71-11.75 1 1 0 00.71-1V29a1 1 0 00-1-1h-4v-2h4a1 1 0 001-1v-4a1 1 0 00-1-1h-4v-2h7v23.29a1 1 0 00.71 1A6 6 0 0136 54z"
      />
    </svg>
  );
}

const ForwardRef = React.forwardRef(SvgSearchKey);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
