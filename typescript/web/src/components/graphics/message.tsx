import * as React from "react";

function SvgMessage(
  props: React.SVGProps<SVGSVGElement>,
  svgRef?: React.Ref<SVGSVGElement>
) {
  return (
    <svg
      id="message_svg__Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 96 96"
      ref={svgRef}
      {...props}
    >
      <defs>
        <style>
          {
            ".message_svg__cls-2{fill:#edab63}.message_svg__cls-4{fill:#dd8c36}.message_svg__cls-5{fill:#dfe2e8}.message_svg__cls-9{fill:#888da0}.message_svg__cls-10{fill:none;stroke:#39426a;stroke-linecap:round;stroke-linejoin:round;stroke-width:2px}"
          }
        </style>
      </defs>
      <path fill="#e69c4b" d="M88 43v52H8V43l4 3.2L48 75l40-32z" />
      <path
        className="message_svg__cls-2"
        d="M74.8 92H21.2a2 2 0 01-1.2-3.56L39.25 73a2 2 0 012.5 0l5 4a2 2 0 002.5 0l5-4a2 2 0 012.5 0l19.3 15.44A2 2 0 0174.8 92zM88 43v43.34a2 2 0 01-3.25 1.56L60.26 68.31a2 2 0 010-3.12z"
      />
      <path d="M83 43h3v42a3 3 0 01-3-3V43z" fill="#f6bc7a" />
      <path
        className="message_svg__cls-2"
        d="M38.63 67.5L15.25 86.2A2 2 0 0112 84.64V46.2z"
      />
      <path
        className="message_svg__cls-4"
        d="M88 43l-9 7.2V35.8l9 7.2zM17 35.8v14.4L8 43l9-7.2z"
      />
      <path
        className="message_svg__cls-5"
        d="M79 11v39.2L50.75 72.8 48 75 17 50.2V1h52l10 10z"
      />
      <path
        d="M79 11v39.2L54.5 69.8a6 6 0 01-7.5 0L22.25 50A6 6 0 0120 45.32V1h49z"
        fill="#f4f5f6"
      />
      <path className="message_svg__cls-5" d="M79 11v3H68a2 2 0 01-2-2V1h3z" />
      <path fill="#ccd1dc" d="M79 11H69V1l10 10z" />
      <path
        d="M89 42.93v-.1a1.83 1.83 0 00-.08-.25v-.08a.92.92 0 00-.22-.26L80 35.32V11v-.06a2 2 0 000-.26.36.36 0 000-.09 1.17 1.17 0 00-.19-.3l-10-10a1.17 1.17 0 00-.3-.19H17a1 1 0 00-1 1v34.22l-8.62 6.9a.92.92 0 00-.22.26v.08a1.83 1.83 0 00-.08.25v.1c0 .03-.08.09-.08.09v52a.79.79 0 000 .13.51.51 0 000 .2.76.76 0 00.09.18.39.39 0 00.06.11 1.55 1.55 0 00.24.19l.09.06A1 1 0 008 96h80a1 1 0 00.41-.09l.09-.06a1.16 1.16 0 00.24-.2.39.39 0 00.06-.11.76.76 0 00.09-.18.51.51 0 000-.2A.79.79 0 0089 95V43v-.07zm-9-5L86.4 43 80 48.12zM70 3.41L76.59 10H70zM18 2h50v9a1 1 0 001 1h9v37.72l-8.27 6.61L67.65 58l-10 8L48 73.72 38.35 66l-10-8-2.08-1.67L18 49.72zm-2 35.88v10.24L9.6 43zm-7 7.2L16.38 51 38.9 69 9 92.92zM10.85 94L40.5 70.28l6.88 5.5a1.13 1.13 0 00.46.21h.32a1.13 1.13 0 00.46-.21l6.88-5.5L85.15 94zM87 92.92L57.1 69l22.52-18L87 45.08z"
        fill="#39426a"
      />
      <path
        className="message_svg__cls-9"
        d="M60.15 64l-2.5 2h-19.3l-2.5-2h24.3zM69.73 56.33L67.65 58H56a1 1 0 010-2h13a1 1 0 01.73.33zM53 57a1 1 0 01-1 1H28.35l-2.08-1.67A1 1 0 0127 56h25a1 1 0 011 1zM34 18h35a1 1 0 000-2H34a1 1 0 000 2zM69 24H56a1 1 0 000 2h13a1 1 0 000-2zM27 26h25a1 1 0 000-2H27a1 1 0 000 2zM27 34h42a1 1 0 000-2H27a1 1 0 000 2zM43 40a1 1 0 000 2h17a1 1 0 000-2zM69 40h-5a1 1 0 000 2h5a1 1 0 000-2zM27 42h12a1 1 0 000-2H27a1 1 0 000 2zM27 50h42a1 1 0 000-2H27a1 1 0 000 2z"
      />
      <path className="message_svg__cls-10" d="M40.5 69L8 95V43l32.5 26z" />
      <path
        className="message_svg__cls-10"
        d="M88 95H8l32.5-26 7.5 6 7.5-6L88 95z"
      />
      <path className="message_svg__cls-10" d="M88 43v52L55.5 69 88 43z" />
    </svg>
  );
}

const ForwardRef = React.forwardRef(SvgMessage);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
