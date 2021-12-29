import { useState } from "react";
import { Image, ImageProps } from "@chakra-ui/react";

/**
 * Image component separating the loading and error fallback properties
 * @param props
 * @returns
 */
export const ImageWithFallback = (
  props: Omit<ImageProps, "fallbackSrc" | "fallback"> & {
    loadingFallbackSrc?: string;
    loadingFallback?: React.ReactElement;
    errorFallbackSrc?: string;
    errorFallback?: React.ReactElement;
  }
) => {
  const [hasError, setHasError] = useState(false);
  const {
    loadingFallbackSrc,
    loadingFallback,
    errorFallbackSrc,
    errorFallback,
  } = props;

  return (
    <Image
      {...props}
      fallback={hasError ? errorFallback : loadingFallback}
      fallbackSrc={hasError ? errorFallbackSrc : loadingFallbackSrc}
      onError={() => setHasError(true)}
      backgroundSize="contain"
    />
  );
};
