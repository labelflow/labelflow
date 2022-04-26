/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import {
  IconButton,
  Tooltip,
  Text,
  HStack,
  NumberInput,
  useColorModeValue,
  NumberInputField,
} from "@chakra-ui/react";
import { RiArrowRightSLine, RiArrowLeftSLine } from "react-icons/ri";
import { isNaN, isNumber } from "lodash/fp";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { useHotkeys } from "react-hotkeys-hook";

import { useImagesNavigation } from "../../../hooks/use-images-navigation";
import { keymap } from "../../../keymap";
import { useDataset, useWorkspace } from "../../../hooks";

const digitsPerRem = 0.55;

const parse = (x: string): number | undefined =>
  !isNaN(parseInt(x, 10)) ? parseInt(x, 10) - 1 : undefined;
const format = (x: number | undefined | null): string =>
  isNumber(x) && !isNaN(x) && x >= 0 ? `${x + 1}` : `-`;

export const ImageNavigationTool = () => {
  const { slug: workspaceSlug } = useWorkspace();
  const { slug: datasetSlug } = useDataset();
  const router = useRouter();

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
    if (typeof currentImageIndex === "number" && currentImageIndex === newIndex)
      return;
    if (newIndex >= 0 && newIndex <= imagesCount - 1) {
      router.push(
        `/${workspaceSlug}/datasets/${datasetSlug}/images/${images[newIndex]?.id}`
      );
    }
  };

  const goTo = (val: string): void => {
    const newIndex = parse(val);
    goToIndex(newIndex);
  };

  const reset = () => {
    setValue(format(currentImageIndex));
  };

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      goTo(event.target.value);
    }

    // Pressing escape cancels the current change
    if (event.key === "Escape" || event.key === "Esc") {
      event.preventDefault();
      reset();
    }
  };

  const handleBlur = () => {
    // On blur we apply the change
    // (This is needed because on mobile you don't have the key "Enter" on digit keyboard)
    goTo(value);

    // Before, we used to do this, but it made the component unusable on mobile
    // So instead, we allow to reset if user presses escape
    // reset();
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

  const arrowBackgroundColor = useColorModeValue("white", "gray.800");

  return (
    <HStack
      h={10}
      p={0}
      spacing={1}
      background={useColorModeValue("white", "gray.800")}
      rounded={6}
      pointerEvents="initial"
    >
      {previousImageId != null ? (
        <NextLink
          href={`/${workspaceSlug}/datasets/${datasetSlug}/images/${previousImageId}`}
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
                backgroundColor={arrowBackgroundColor}
                icon={<RiArrowLeftSLine size="1.5em" />}
              />
            </Tooltip>
          </a>
        </NextLink>
      ) : (
        <IconButton
          disabled
          backgroundColor={arrowBackgroundColor}
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
          onKeyDown={handleKeyDown}
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
        <NextLink
          href={`/${workspaceSlug}/datasets/${datasetSlug}/images/${nextImageId}`}
        >
          <a>
            <Tooltip
              label={`Next image [${keymap.goToNextImage.key}]`}
              placement="top"
              openDelay={300}
            >
              <IconButton
                aria-label="Next image"
                backgroundColor={arrowBackgroundColor}
                icon={<RiArrowRightSLine size="1.5em" />}
              />
            </Tooltip>
          </a>
        </NextLink>
      ) : (
        <IconButton
          disabled
          backgroundColor={arrowBackgroundColor}
          aria-label="No next image"
          icon={<RiArrowRightSLine size="1.5em" />}
        />
      )}
    </HStack>
  );
};
