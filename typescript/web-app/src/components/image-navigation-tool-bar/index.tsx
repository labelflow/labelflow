import React, { useRef, useEffect } from "react";
import {
  IconButton,
  Input,
  Text,
  InputRightAddon,
  InputLeftAddon,
  InputGroup,
} from "@chakra-ui/react";
import { RiArrowRightSLine, RiArrowLeftSLine } from "react-icons/ri";
import { findIndex } from "lodash/fp";
import { NextRouter } from "next/router";
import NextLink from "next/link";
import { Image } from "../../types.generated";

export type Props = {
  imageId: string | undefined;
  images: Pick<Image, "id">[] | undefined;
  router: NextRouter;
};

export const ImageNav = ({ imageId, images, router }: Props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const imageIndex: number | undefined =
    images != null && imageId != null
      ? findIndex({ id: imageId }, images)
      : undefined;

  const imageCount = images?.length;

  const handleKeyPress = (event: any) => {
    if (!images) return;
    if (!inputRef.current) return;
    if (imageCount == null) return;
    if (event.key === "Enter") {
      const value = parseInt(event.target.value, 10);
      if (value >= 1 && value <= imageCount) {
        router.push(`/images/${images[value - 1]?.id}`);
      } else if (value < 1) {
        inputRef.current.value = `1`;
      } else if (value > imageCount) {
        inputRef.current.value = `${imageCount}`;
      }
    }
  };

  const handleClick = () => {
    if (!inputRef.current) return;
    inputRef.current.select();
  };

  const handleBlur = () => {
    if (!inputRef.current) return;
    if (imageIndex == null) return;
    inputRef.current.value = imageIndex >= 0 ? `${imageIndex + 1}` : "-";
  };

  useEffect(() => {
    handleBlur();
  }, [imageIndex]);

  return (
    <InputGroup
      w="fit-content"
      variant="filled"
      background="white"
      color="gray.800"
    >
      <InputLeftAddon p={0}>
        {imageIndex != null && imageIndex > 0 && images != null ? (
          <NextLink href={`/images/${images[imageIndex - 1]?.id}`}>
            <IconButton
              aria-label="Previous image"
              icon={<RiArrowLeftSLine size="1.5em" />}
            />
          </NextLink>
        ) : (
          <IconButton
            disabled
            aria-label="Previous image"
            icon={<RiArrowLeftSLine size="1.5em" />}
          />
        )}
      </InputLeftAddon>

      <Input
        ref={inputRef}
        onKeyPress={handleKeyPress}
        onClick={handleClick}
        onBlur={handleBlur}
        border="none"
        placeholder=""
        textAlign="right"
        defaultValue={
          imageIndex != null && imageIndex >= 0 ? `${imageIndex + 1}` : "-"
        }
        pl={0}
        pr={0}
        w="3em"
        // background="gray.100"
      />

      <Text
        as="input"
        defaultValue={` / `}
        disabled
        opacity={1}
        border="none"
        placeholder=" / "
        textAlign="center"
        pl={0}
        pr={0}
        w="1em"
        // background="gray.100"
      />

      <Text
        as="input"
        defaultValue={`${imageCount ?? "-"}`}
        disabled
        opacity={1}
        border="none"
        placeholder=""
        textAlign="left"
        pl={0}
        pr={0}
        w="3em"
        // background="gray.100"
      />

      <InputRightAddon p={0}>
        {imageIndex != null &&
        imageCount != null &&
        imageIndex >= 0 &&
        imageIndex < imageCount - 1 &&
        images != null ? (
          <NextLink href={`/images/${images[imageIndex + 1]?.id}`}>
            <IconButton
              aria-label="Next image"
              icon={<RiArrowRightSLine size="1.5em" />}
            />
          </NextLink>
        ) : (
          <IconButton
            disabled
            aria-label="Next image"
            icon={<RiArrowRightSLine size="1.5em" />}
          />
        )}
      </InputRightAddon>
    </InputGroup>
  );
};
