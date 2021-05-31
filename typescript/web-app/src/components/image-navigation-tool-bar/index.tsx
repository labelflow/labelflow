import React, { useState, useEffect } from "react";
import {
  IconButton,
  Text,
  HStack,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import { RiArrowRightSLine, RiArrowLeftSLine } from "react-icons/ri";
import { findIndex, isNaN, isNumber } from "lodash/fp";
import { NextRouter } from "next/router";
import NextLink from "next/link";
import { useHotkeys } from "react-hotkeys-hook";

import { keymap } from "../../keymap";

import { Image } from "../../types.generated";

export type Props = {
  imageId: string | undefined;
  images: Pick<Image, "id">[] | undefined;
  router: NextRouter;
};

const digitsPerRem = 0.55;

const parse = (x: string): number | undefined =>
  !isNaN(parseInt(x, 10)) ? parseInt(x, 10) - 1 : undefined;
const format = (x: number | undefined): string =>
  isNumber(x) && !isNaN(x) && x >= 0 ? `${x + 1}` : `-`;

export const ImageNav = ({ imageId, images, router }: Props) => {
  const imageIndex: number | undefined =
    images != null && imageId != null
      ? findIndex({ id: imageId }, images)
      : undefined;

  const imageCount = images?.length;

  const digitCount = Math.max(1, Math.ceil(Math.log10(imageCount ?? 1)));

  const [value, setValue] = useState<string>(format(imageIndex));

  const goToIndex = (newIndex: number | undefined) => {
    if (!images) return;
    if (imageCount == null) return;

    if (newIndex == null || isNaN(newIndex)) return;
    if (newIndex >= 0 && newIndex <= imageCount - 1) {
      router.push(`/images/${images[newIndex]?.id}`);
    }
  };

  const goTo = (val: string): void => {
    const newIndex = parse(val);
    goToIndex(newIndex);
  };

  const reset = () => {
    setValue(format(imageIndex));
  };

  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      goTo(event.target.value);
    }
  };

  const handleBlur = () => {
    // On blur we could go to the value input by the user:
    // goTo(value);
    //
    // But that would prevent the user from ever cancelling their input
    // So instead, we reset the number:
    reset();
  };

  const selectText: React.MouseEventHandler<HTMLInputElement> = (event) => {
    (event.target as HTMLInputElement).select();
  };

  useEffect(() => {
    reset();
  }, [imageIndex]);

  useHotkeys(
    keymap.goToPreviousImage.key,
    () => typeof imageIndex === "number" && goToIndex(imageIndex - 1),
    {},
    [goToIndex, imageIndex]
  );

  useHotkeys(
    keymap.goToNextImage.key,
    () => typeof imageIndex === "number" && goToIndex(imageIndex + 1),
    {},
    [goToIndex, imageIndex]
  );

  return (
    <HStack
      h={10}
      p={0}
      spacing={1}
      background="white"
      rounded={6}
      pointerEvents="initial"
    >
      {imageIndex != null && imageIndex > 0 && images != null ? (
        <NextLink href={`/images/${images[imageIndex - 1]?.id}`}>
          <IconButton
            aria-label="Previous image"
            variant="ghost"
            icon={<RiArrowLeftSLine size="1.5em" />}
          />
        </NextLink>
      ) : (
        <IconButton
          disabled
          variant="ghost"
          aria-label="No previous image"
          icon={<RiArrowLeftSLine size="1.5em" />}
        />
      )}

      <NumberInput
        rounded={6}
        allowMouseWheel
        defaultValue={imageIndex != null ? imageIndex + 1 : "-"}
        min={1}
        max={imageCount}
        variant="filled"
        textAlign="right"
        size="sm"
        value={value}
        onChange={setValue}
        onKeyPress={handleKeyPress}
        onBlur={handleBlur}
      >
        <NumberInputField
          rounded={6}
          onClick={selectText}
          textAlign="right"
          w={`${digitCount * digitsPerRem + 1}rem`}
          pr={2}
          pl={0}
        />
      </NumberInput>

      <Text textAlign="center" userSelect="none">
        {" "}
        /{" "}
      </Text>
      <Text
        pr={0}
        pl={2}
        w={`${digitCount * digitsPerRem + 1}rem`}
        textAlign="left"
        cursor="default"
        fontSize="sm"
      >{`${imageCount ?? "-"}`}</Text>

      {imageIndex != null &&
      imageCount != null &&
      imageIndex >= 0 &&
      imageIndex < imageCount - 1 &&
      images != null ? (
        <NextLink href={`/images/${images[imageIndex + 1]?.id}`}>
          <IconButton
            aria-label="Next image"
            variant="ghost"
            icon={<RiArrowRightSLine size="1.5em" />}
          />
        </NextLink>
      ) : (
        <IconButton
          disabled
          variant="ghost"
          aria-label="No next image"
          icon={<RiArrowRightSLine size="1.5em" />}
        />
      )}
    </HStack>
  );
};
