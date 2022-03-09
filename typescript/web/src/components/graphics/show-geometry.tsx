import { useColorModeValue as mode } from "@chakra-ui/react";
import * as React from "react";
import { SVGProps, Ref, forwardRef, memo } from "react";

const SvgShowGeometry = (
  props: SVGProps<SVGSVGElement>,
  ref: Ref<SVGSVGElement>
) => {
  const color = mode("black", "white");
  return (
    <svg
      width={26}
      height={27}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      ref={ref}
      {...props}
    >
      <path
        d="M12 3.02c5.392 0 9.878 3.88 10.819 9-.94 5.12-5.427 9-10.82 9-5.391 0-9.877-3.88-10.818-9 .94-5.12 5.427-9 10.819-9Zm0 16a9.004 9.004 0 0 0 8.777-7 9.005 9.005 0 0 0-17.554 0 9.005 9.005 0 0 0 8.777 7Zm0-2.5a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9Zm0-2a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.866 26.02h1.165l.666-1.925h2.842l.665 1.925h1.164l-.334-.93-1.134-.995-.519-.456-.532-.467h-1.832l.427-1.234-.843-.74-1.735 4.822Zm2.099-5.832.832.73.294-.85h.056l.574 1.662 1.613 1.415-1.583-4.398h-1.268l-.518 1.44Z"
        fill={color}
      />
      <path stroke={color} d="m19.453 20.429 6.005 5.503" />
    </svg>
  );
};

const ForwardRef = forwardRef(SvgShowGeometry);
const Memo = memo(ForwardRef);
export default Memo;
