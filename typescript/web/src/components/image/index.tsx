import { Image, ImageProps, useBoolean } from "@chakra-ui/react";

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
  loadingFallback,
  errorFallback,
  loadingFallbackSrc,
  errorFallbackSrc,
  ...props
}: ImageWithFallbackProps) => {
  const [hasError, setHasError] = useBoolean(false);
  return (
    <Image
      fallback={hasError ? errorFallback : loadingFallback}
      fallbackSrc={hasError ? errorFallbackSrc : loadingFallbackSrc}
      onError={setHasError.on}
      backgroundSize="contain"
      {...props}
    />
  );
};
