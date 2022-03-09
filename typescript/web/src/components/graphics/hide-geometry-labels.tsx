import { useColorModeValue as mode } from "@chakra-ui/react";
import * as React from "react";
import { SVGProps, Ref, forwardRef, memo } from "react";

const SvgHideGeometryLabels = (
  props: SVGProps<SVGSVGElement>,
  ref: Ref<SVGSVGElement>
) => (
  <svg
    width={24}
    height={25}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    ref={ref}
    {...props}
  >
    <path
      d="M17.882 19.316A10.949 10.949 0 0 1 12 21.02c-5.392 0-9.878-3.88-10.82-9a10.982 10.982 0 0 1 3.34-6.066L1.393 2.827l1.415-1.415 19.799 19.8-1.415 1.414-3.31-3.31ZM5.935 7.37a8.965 8.965 0 0 0-2.712 4.65 9.005 9.005 0 0 0 13.2 5.838l-2.027-2.028A4.5 4.5 0 0 1 8.19 9.623L5.935 7.37Zm6.979 6.978-3.242-3.242a2.5 2.5 0 0 0 3.24 3.241l.002.001Zm7.893 2.264-1.431-1.43a8.936 8.936 0 0 0 1.4-3.162A9.006 9.006 0 0 0 9.553 5.357L7.974 3.78A10.99 10.99 0 0 1 12 3.02c5.392 0 9.878 3.88 10.819 9a10.949 10.949 0 0 1-2.012 4.592Zm-9.084-9.084a4.5 4.5 0 0 1 4.769 4.77l-4.77-4.77Z"
      fill={mode("black", "white")}
    />
  </svg>
);

const ForwardRef = forwardRef(SvgHideGeometryLabels);
const Memo = memo(ForwardRef);
export default Memo;
