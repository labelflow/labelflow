import { useColorModeValue as mode } from "@chakra-ui/react";
import * as React from "react";
import { SVGProps, Ref, forwardRef, memo } from "react";

const SvgShowGeometryLabels = (
  props: SVGProps<SVGSVGElement>,
  ref: Ref<SVGSVGElement>
) => (
  <svg
    width={26}
    height={27}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    ref={ref}
    {...props}
  >
    <path
      d="M12 3.02c5.392 0 9.878 3.88 10.819 9-.94 5.12-5.427 9-10.82 9-5.391 0-9.877-3.88-10.818-9 .94-5.12 5.427-9 10.819-9Zm0 16a9.004 9.004 0 0 0 8.777-7 9.005 9.005 0 0 0-17.554 0 9.005 9.005 0 0 0 8.777 7Zm0-2.5a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9Zm0-2a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM20.031 26.02h-1.165l2.617-7.273h1.268l2.617 7.273h-1.164l-2.056-5.952h-.057l-2.06 5.952Zm.195-2.848h3.779v.923h-3.779v-.923Z"
      fill={mode("black", "red.500")}
    />
  </svg>
);

const ForwardRef = forwardRef(SvgShowGeometryLabels);
const Memo = memo(ForwardRef);
export default Memo;
