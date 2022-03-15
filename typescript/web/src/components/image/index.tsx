import { Image, ImageProps, useBoolean } from "@chakra-ui/react";
import { isNil } from "lodash/fp";

export type ImageWithFallbackProps = Omit<
  ImageProps,
  "fallbackSrc" | "fallback"
> & {
  loadingFallbackSrc?: string;
  loadingFallback?: React.ReactElement;
  errorFallbackSrc?: string;
  errorFallback?: React.ReactElement;
};

/** Image component separating the loading and error fallback properties */
export const ImageWithFallback = ({
  src,
  loadingFallback,
  errorFallback,
  loadingFallbackSrc,
  errorFallbackSrc,
  ...props
}: ImageWithFallbackProps) => {
  const [hasError, setHasError] = useBoolean(isNil(src));
  return (
    <Image
      src={src}
      fallback={hasError ? errorFallback : loadingFallback}
      fallbackSrc={hasError ? errorFallbackSrc : loadingFallbackSrc}
      onError={setHasError.on}
      backgroundSize="contain"
      {...props}
    />
  );
};
