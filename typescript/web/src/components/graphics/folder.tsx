import * as React from "react";

function SvgFolder(
  props: React.SVGProps<SVGSVGElement>,
  svgRef?: React.Ref<SVGSVGElement>
) {
  return (
    <svg
      id="folder_svg__Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 96 96"
      ref={svgRef}
      {...props}
    >
      <defs>
        <style>
          {
            ".folder_svg__cls-1{fill:#dd8c36}.folder_svg__cls-7{fill:#edab63}.folder_svg__cls-10{fill:#888da0}"
          }
        </style>
      </defs>
      <path
        className="folder_svg__cls-1"
        d="M74 31h6v22h-6zM18 47L8.55 92.37A3.31 3.31 0 015.31 95 3.31 3.31 0 012 91.69V31h6z"
      />
      <path fill="#b9c1d0" d="M8 1h60v80H8z" />
      <path fill="#ccd1dc" d="M14 7h60v51H14z" />
      <path
        d="M73 7v36a6 6 0 01-6 6H47.79a4 4 0 01-3.53-2.13 7.25 7.25 0 00-1.52-2A7.17 7.17 0 0037.83 43H19a4 4 0 01-4-4V7z"
        fill="#dfe2e8"
      />
      <rect x={46} y={10} width={25} height={36} rx={4} fill="#f4f5f6" />
      <path
        d="M94.75 53l-8.08 38.77-.12.6A3.31 3.31 0 0183.31 95h-78a3.32 3.32 0 003.23-2.58L18 47h20a3 3 0 013 3 3 3 0 003 3z"
        fill="#e69c4b"
      />
      <path
        className="folder_svg__cls-7"
        d="M93.75 56l-6.59 31.64a8 8 0 01-7 4.13H24.94a10 10 0 01-9.79-12L21.35 50H36a3 3 0 013 3 3 3 0 003 3z"
      />
      <path
        className="folder_svg__cls-7"
        d="M91.14 53l-.63 3H79.19l.62-3h11.33z"
      />
      <path
        d="M90.51 56l-6.13 29.4a8 8 0 01-7.83 6.37H65.23a8 8 0 007.83-6.37L79.19 56z"
        fill="#f6bc7a"
      />
      <path
        d="M95.75 53v-.1a1.29 1.29 0 000-.19 1.34 1.34 0 00-.07-.18 1.3 1.3 0 00-.1-.15 1.85 1.85 0 00-.14-.14l-.15-.1-.29-.08V52a.33.33 0 00-.1 0H81V31a1 1 0 00-1-1h-5V7a1 1 0 00-1-1h-5V1a1 1 0 00-1-1H8a1 1 0 00-1 1v29H2a1 1 0 00-1 1v60.69A4.31 4.31 0 005.31 96H83a.8.8 0 00.15 0 .9.9 0 00.16 0 4.33 4.33 0 004.22-3.43l8.2-39.37a.33.33 0 000-.1l.02-.1zM79 32v20h-4V32zm-6 20H44a2 2 0 01-2-2 4 4 0 00-4-4H17.9a.47.47 0 00-.17 0 .51.51 0 00-.17.07l-.15.08a1 1 0 00-.15.14 1.27 1.27 0 00-.1.12 1.16 1.16 0 00-.14.34l-2 9.7V8H73zM9 2h58v4H14a1 1 0 00-1 1v59.1L10.1 80H9zM3 91.69V32h4v49a1 1 0 001 1h1.69L7.57 92.16A2.31 2.31 0 013 91.69zm82.57.48A2.31 2.31 0 0183.31 94a.9.9 0 00-.16 0 .8.8 0 00-.15 0H8.94a4.43 4.43 0 00.55-1.3v-.08L18.81 48H38a2 2 0 012 2 4 4 0 004 4h49.52z"
        fill="#39426a"
      />
      <path
        className="folder_svg__cls-10"
        d="M65 16H30a1 1 0 000 2h35a1 1 0 000-2zM65 24H52a1 1 0 000 2h13a1 1 0 000-2zM23 26h25a1 1 0 000-2H23a1 1 0 000 2zM65 32H23a1 1 0 000 2h42a1 1 0 000-2zM56 40H39a1 1 0 000 2h17a1 1 0 000-2zM65 40h-5a1 1 0 000 2h5a1 1 0 000-2zM35 40H23a1 1 0 000 2h12a1 1 0 000-2z"
      />
    </svg>
  );
}

const ForwardRef = React.forwardRef(SvgFolder);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
