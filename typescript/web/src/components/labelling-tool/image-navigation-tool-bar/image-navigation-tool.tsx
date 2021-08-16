/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import {
  IconButton,
  Tooltip,
  Text,
  HStack,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import { RiArrowRightSLine, RiArrowLeftSLine } from "react-icons/ri";
import { isNaN, isNumber } from "lodash/fp";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { useHotkeys } from "react-hotkeys-hook";

import { useImagesNavigation } from "../../../hooks/use-images-navigation";
import { keymap } from "../../../keymap";

const digitsPerRem = 0.55;

const parse = (x: string): number | undefined =>
  !isNaN(parseInt(x, 10)) ? parseInt(x, 10) - 1 : undefined;
const format = (x: number | undefined | null): string =>
  isNumber(x) && !isNaN(x) && x >= 0 ? `${x + 1}` : `-`;

export const ImageNavigationTool = () => {
  const router = useRouter();

  const { datasetId } = router?.query;

  const {
    images,
    imagesCount,
    currentImageIndex,
    previousImageId,
    nextImageId,
  } = useImagesNavigation();

  const digitCount = Math.max(1, Math.ceil(Math.log10(imagesCount ?? 1)));

  const [value, setValue] = useState<string>(format(currentImageIndex));

  const goToIndex = (newIndex: number | undefined) => {
    if (!images) return;
    if (imagesCount == null) return;

    if (newIndex == null || isNaN(newIndex)) return;
    if (newIndex >= 0 && newIndex <= imagesCount - 1) {
      router.push(`/datasets/${datasetId}/images/${images[newIndex]?.id}`);
    }
  };

  const goTo = (val: string): void => {
    const newIndex = parse(val);
    goToIndex(newIndex);
  };

  const reset = () => {
    setValue(format(currentImageIndex));
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
  }, [currentImageIndex]);

  useHotkeys(
    keymap.goToPreviousImage.key,
    () =>
      typeof currentImageIndex === "number" && goToIndex(currentImageIndex - 1),
    {},
    [goToIndex, currentImageIndex]
  );

  useHotkeys(
    keymap.goToNextImage.key,
    () =>
      typeof currentImageIndex === "number" && goToIndex(currentImageIndex + 1),
    {},
    [goToIndex, currentImageIndex]
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
      {previousImageId != null ? (
        <NextLink
          href={`/datasets/${datasetId}/images/${previousImageId}`}
          passHref
        >
          <a>
            <Tooltip
              openDelay={300}
              label={`Previous image [${keymap.goToPreviousImage.key}]`}
              placement="top"
            >
              <IconButton
                aria-label="Previous image"
                backgroundColor="white"
                icon={<RiArrowLeftSLine size="1.5em" />}
              />
            </Tooltip>
          </a>
        </NextLink>
      ) : (
        <IconButton
          disabled
          backgroundColor="white"
          aria-label="No previous image"
          icon={<RiArrowLeftSLine size="1.5em" />}
        />
      )}
      <Tooltip label="Current image index" placement="top" openDelay={300}>
        <NumberInput
          name="current-image"
          rounded={6}
          allowMouseWheel
          defaultValue={currentImageIndex != null ? currentImageIndex + 1 : "-"}
          min={1}
          max={imagesCount}
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
      </Tooltip>

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
      >{`${imagesCount ?? "-"}`}</Text>

      {nextImageId != null ? (
        <NextLink href={`/datasets/${datasetId}/images/${nextImageId}`}>
          <a>
            <Tooltip
              label={`Next image [${keymap.goToNextImage.key}]`}
              placement="top"
              openDelay={300}
            >
              <IconButton
                aria-label="Next image"
                backgroundColor="white"
                icon={<RiArrowRightSLine size="1.5em" />}
              />
            </Tooltip>
          </a>
        </NextLink>
      ) : (
        <IconButton
          disabled
          backgroundColor="white"
          aria-label="No next image"
          icon={<RiArrowRightSLine size="1.5em" />}
        />
      )}
    </HStack>
  );
};
