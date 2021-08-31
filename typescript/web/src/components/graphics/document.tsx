import * as React from "react";

function SvgDocument(
  props: React.SVGProps<SVGSVGElement>,
  svgRef?: React.Ref<SVGSVGElement>
) {
  return (
    <svg
      id="document_svg__Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 96 96"
      ref={svgRef}
      {...props}
    >
      <defs>
        <style>
          {
            ".document_svg__cls-1{fill:#dfe2e8}.document_svg__cls-2{fill:#b9c1d0}.document_svg__cls-5{fill:#888da0}"
          }
        </style>
      </defs>
      <path
        className="document_svg__cls-1"
        d="M95 15.3L88.03 95l-37.31-3.27-11.57-1.01L78 13.82l3 .26 14 1.22z"
      />
      <path
        className="document_svg__cls-2"
        d="M81 82a2 2 0 01-2 2h-2.08v.07l.17 1a2 2 0 01-1.62 2.31l-24.75 4.35-11.57-1L78 13.82l3 .26z"
      />
      <path
        className="document_svg__cls-1"
        d="M73.98 84.58L14.89 95 1 16.22l14-2.47 3-.53L73.35 81l.53 3 .1.58z"
      />
      <path
        className="document_svg__cls-2"
        d="M73.88 84H17a2 2 0 01-2-2V13.75l3-.53L73.35 81z"
      />
      <path className="document_svg__cls-1" d="M18 1h60v80H18z" />
      <path d="M78 1v77H31a10 10 0 01-10-10V1z" fill="#f4f5f6" />
      <path
        d="M95.77 14.66a1 1 0 00-.68-.36L79 12.9V1a1 1 0 00-1-1H18a1 1 0 00-1 1v11.38L.83 15.24A1 1 0 000 16.39l13.91 78.78a1 1 0 00.41.65 1 1 0 00.57.18.47.47 0 00.17 0l24.14-4.27L87.94 96H88a1 1 0 00.64-.23 1 1 0 00.36-.68l7-79.7a1 1 0 00-.23-.73zM19 2h58v78H19zM2.16 17L17 14.41V81a1 1 0 001 1h54.51l.31 1.77L15.7 93.84zm85 76.89l-40.35-3.5 27.34-4.83a1 1 0 00.85-1.15L74.54 82H78a1 1 0 001-1V14.91l14.92 1.3z"
        fill="#39426a"
      />
      <path
        className="document_svg__cls-5"
        d="M69 12H34a1 1 0 000 2h35a1 1 0 000-2zM69 20H56a1 1 0 000 2h13a1 1 0 000-2zM27 22h25a1 1 0 000-2H27a1 1 0 000 2zM69 28H27a1 1 0 000 2h42a1 1 0 000-2zM60 38a1 1 0 000-2H43a1 1 0 000 2zM69 36h-5a1 1 0 000 2h5a1 1 0 000-2zM27 38h12a1 1 0 000-2H27a1 1 0 000 2zM69 44H27a1 1 0 000 2h42a1 1 0 000-2zM69 52H56a1 1 0 000 2h13a1 1 0 000-2zM27 54h25a1 1 0 000-2H27a1 1 0 000 2zM69 60H27a1 1 0 000 2h42a1 1 0 000-2zM62 68H43a1 1 0 000 2h19a1 1 0 000-2zM39 68H27a1 1 0 000 2h12a1 1 0 000-2z"
      />
    </svg>
  );
}

const ForwardRef = React.forwardRef(SvgDocument);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
