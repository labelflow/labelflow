import { forwardRef, memo } from "react";
import { chakra, HTMLChakraProps } from "@chakra-ui/react";

function SvgNoImages(
  props: HTMLChakraProps<"svg">,
  svgRef?: React.Ref<SVGSVGElement>
) {
  return (
    <chakra.svg
      width="250"
      height="200"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      ref={svgRef}
      {...props}
    >
      <defs>
        <style>
          {
            ".no-images_svg__cls-1{fill:#ccd1dc}.no-images_svg__cls-2{fill:#dee1e7}.no-images_svg__cls-3{fill:#f3f4f5}.no-images_svg__cls-4{fill:#abd9e6}.no-images_svg__cls-7{fill:#c3e1f5}.no-images_svg__cls-8{fill:#85bd79}.no-images_svg__cls-9{fill:#9fc98a}.no-images_svg__cls-10{fill:#f6b756}.no-images_svg__cls-11{fill:#fac77d}.no-images_svg__cls-12{fill:#39426a}"
          }
        </style>
      </defs>
      <path
        className="no-images_svg__cls-1"
        transform="rotate(-75 56.966 44.57)"
        d="M21.96 14.57h70v60h-70z"
      />
      <path
        className="no-images_svg__cls-2"
        d="M95 18.53L77.66 83.25 34.19 71.6a12 12 0 01-8.48-14.7L39.94 3.78z"
      />
      <rect
        className="no-images_svg__cls-3"
        x={56.76}
        y={16.1}
        width={27}
        height={62}
        rx={2}
        transform="rotate(15 70.259 47.083)"
      />
      <path
        className="no-images_svg__cls-4"
        transform="rotate(-75 57.999 40)"
        d="M34 16h48v48H34z"
      />
      <path
        d="M77.3 61.41l-2.07 7.73L61 65.33v-8.24a8.15 8.15 0 01.85.18c3.86 1 3.35 3 7.21 4s4.38-.9 8.24.14z"
        fill="#7190c4"
      />
      <path
        d="M79.11 54.65l-1.81 6.76c-3.86-1-4.38.9-8.24-.14s-3.35-3-7.21-4a8.15 8.15 0 00-.85-.18v-6.88a7.8 7.8 0 012.66.3c3.86 1 3.35 3 7.21 4s4.38-.9 8.24.14z"
        fill="#89a3ce"
      />
      <path
        className="no-images_svg__cls-7"
        d="M87.39 23l-7 26.08c-24-6.43-40.34-23.32-36.48-37.73z"
      />
      <path className="no-images_svg__cls-1" d="M1 27h60v70H1z" />
      <path
        className="no-images_svg__cls-2"
        d="M61 27v67H16A12 12 0 014 82V27z"
      />
      <rect
        className="no-images_svg__cls-3"
        x={31}
        y={30}
        width={27}
        height={62}
        rx={2}
      />
      <path className="no-images_svg__cls-4" d="M7 33h48v48H7z" />
      <path
        className="no-images_svg__cls-8"
        d="M55 74v7H39L28.66 70.66l11.5-11.5L55 74z"
      />
      <path
        className="no-images_svg__cls-8"
        d="M55 74v7H39L28.66 70.66l11.5-11.5L55 74z"
      />
      <path
        className="no-images_svg__cls-9"
        d="M55 74v7H43l-.6-.6a17.24 17.24 0 01-2.85-20.63l.61-.61z"
      />
      <path
        className="no-images_svg__cls-8"
        d="M39 81H7v-1.68l15.16-15.16L39 81z"
      />
      <path
        className="no-images_svg__cls-9"
        d="M39 81l-10.59-.56a9.55 9.55 0 01-6.25-16.28z"
      />
      <path
        className="no-images_svg__cls-7"
        d="M55 33v27c-24.85 0-45-12.09-45-27h45z"
      />
      <path
        className="no-images_svg__cls-10"
        d="M33 49a5 5 0 01-10 0 5.34 5.34 0 01.22-1.5 5 5 0 019.56 0A5.34 5.34 0 0133 49z"
      />
      <ellipse
        className="no-images_svg__cls-11"
        cx={28}
        cy={47.5}
        rx={4.78}
        ry={3.5}
      />
      <path
        className="no-images_svg__cls-10"
        d="M73 33a5 5 0 01-10 0 5.34 5.34 0 01.22-1.5 5 5 0 019.56 0A5.34 5.34 0 0173 33z"
      />
      <ellipse
        className="no-images_svg__cls-11"
        cx={68}
        cy={31.5}
        rx={4.78}
        ry={3.5}
      />
      <path
        className="no-images_svg__cls-12"
        d="M7 82h48a1 1 0 001-1V33a1 1 0 00-1-1H7a1 1 0 00-1 1v48a1 1 0 001 1zm1-2.27l14.16-14.16L36.59 80H8zm31.41.27l-9.34-9.34 10.09-10.09L54 74.41V80zM54 34v37.59L40.87 58.45a1 1 0 00-1.42 0l-10.79 10.8-5.79-5.8a1 1 0 00-1.42 0L8 76.91V34z"
      />
      <path
        className="no-images_svg__cls-12"
        d="M28 55a6 6 0 10-6-6 6 6 0 006 6zm0-10a4 4 0 11-4 4 4 4 0 014-4zM28 41a1 1 0 001-1v-2a1 1 0 00-2 0v2a1 1 0 001 1zM28 57a1 1 0 00-1 1v2a1 1 0 002 0v-2a1 1 0 00-1-1zM36 49a1 1 0 001 1h2a1 1 0 000-2h-2a1 1 0 00-1 1zM17 50h2a1 1 0 000-2h-2a1 1 0 000 2zM34.36 43.64a1 1 0 00.71-.3l1.42-1.41a1 1 0 00-1.42-1.42l-1.41 1.42a1 1 0 000 1.41 1 1 0 00.7.3zM20.93 54.66l-1.42 1.41a1 1 0 000 1.42 1 1 0 00.71.29 1 1 0 00.71-.29l1.41-1.42a1 1 0 10-1.41-1.41zM35.07 54.66a1 1 0 10-1.41 1.41l1.41 1.42a1 1 0 00.71.29 1 1 0 00.71-.29 1 1 0 000-1.42zM20.93 43.34a1 1 0 001.41 0 1 1 0 000-1.41l-1.41-1.42a1 1 0 10-1.42 1.42z"
      />
      <path
        className="no-images_svg__cls-12"
        d="M95.87 18a1.06 1.06 0 00-.61-.47L37.3 2a1 1 0 00-1.23.71L29.84 26H1a1 1 0 00-1 1v70a1 1 0 001 1h60a1 1 0 001-1V83.19l14.62 3.92a1.15 1.15 0 00.26 0 1 1 0 001-.74L96 18.79a1.05 1.05 0 00-.13-.79zM60 96H2V28h58zm2-37.64A6.74 6.74 0 0164.79 60a8.76 8.76 0 004 2.22 9.32 9.32 0 002.44.35 10 10 0 002.14-.27 6.79 6.79 0 012.68-.15l-1.54 5.75L62 64.56zm14.58 1.87a8.57 8.57 0 00-3.6.13 7.53 7.53 0 01-6.86-1.84 8.74 8.74 0 00-4-2.22h-.1v-5.07a7.67 7.67 0 011.4.25 6.6 6.6 0 013.2 1.78 9 9 0 004 2.22 9.62 9.62 0 002.43.34 10 10 0 002.15-.26 6.79 6.79 0 012.68-.15zm1.81-6.76a8.73 8.73 0 00-3.6.13 7.53 7.53 0 01-6.86-1.84 8.76 8.76 0 00-4-2.22 10 10 0 00-1.93-.32V27a1 1 0 00-1-1H38.13L42 11.57l44.43 11.91zm-2.22 31.45L62 81.12V66.63l13 3.48h.26a1 1 0 001-.74L88.62 23a1 1 0 00-.71-1.23L41.55 9.38a1.05 1.05 0 00-.76.1 1 1 0 00-.47.61L36.06 26h-4.15l5.84-21.78 56 15z"
      />
      <path
        className="no-images_svg__cls-12"
        d="M74 34.77A6 6 0 1066.6 39a6.4 6.4 0 001.55.2A6 6 0 0074 34.77zm-2-.51a4 4 0 11-2.83-4.9 4 4 0 012.83 4.9zM70.22 25.49a.82.82 0 00.26 0 1 1 0 001-.74l.52-1.9a1 1 0 00-.7-1.22 1 1 0 00-1.23.71l-.51 1.93a1 1 0 00.66 1.22zM66.08 41a1 1 0 00-1.22.71l-.52 1.93a1 1 0 00.71 1.22 1.09 1.09 0 00.26 0 1 1 0 001-.75l.52-1.93a1 1 0 00-.75-1.18zM79 35.1l-1.94-.52a1 1 0 00-.51 1.94l1.93.51a.78.78 0 00.26 0 1 1 0 00.26-2zM63.65 26.43a1 1 0 00.87-1.5l-1-1.74a1 1 0 00-1.37-.36 1 1 0 00-.36 1.36l1 1.74a1 1 0 00.86.5zM73.52 40.51a1 1 0 00-1.37-.36 1 1 0 00-.36 1.36l1 1.74a1 1 0 001.73-1zM76.45 29.59l1.73-1a1 1 0 00-1-1.74l-1.73 1a1 1 0 001 1.74z"
      />
    </chakra.svg>
  );
}

const ForwardRef = forwardRef(SvgNoImages);
export const EmptyStateNoImages = memo(ForwardRef);
