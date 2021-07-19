import React, { useState, useRef } from "react";

import { Popover, PopoverBody, PopoverContent, VStack } from "@chakra-ui/react";
import { withNextRouter } from "storybook-addon-next-router";

import { chakraDecorator } from "../../../../utils/chakra-decorator";
import { queryParamsDecorator } from "../../../../utils/query-params-decorator";

import { DrawingToolIcon } from "../drawing-tool";
import { Tools } from "../../../../connectors/labelling-state";

export default {
  title: "web-app/Drawing Toolbar/Drawing Tool",
  component: DrawingToolIcon,
  parameters: {
    nextRouter: {
      path: "/images/[id]",
      asPath: "/images/mock-image-id",
      query: {
        id: "mock-image-id",
      },
    },
  },
  decorators: [chakraDecorator, queryParamsDecorator, withNextRouter],
};

// @ts-ignore
export const Default = () => {
  const [isPopoverOpened, setIsPopoverOpened] = useState(false);
  const buttonRef = useRef(null);

  return (
    <VStack background="gray.100" padding={4} spacing={4} h="640px" w="72px">
      <Popover
        isOpen={isPopoverOpened}
        placement="right-start"
        closeOnBlur
        onClose={() => {
          setIsPopoverOpened(false);
        }}
      >
        <DrawingToolIcon
          buttonRef={buttonRef}
          isDisabled={false}
          onClickDetails={() => console.log("ok")}
          selectedTool={Tools.BOX}
          setSelectedTool={console.log}
        />
        <PopoverContent
          borderColor="gray.200"
          cursor="default"
          pointerEvents="initial"
          aria-label="changeme"
          width="60"
        >
          <PopoverBody pl="0" pr="0" pt="0">
            Ok popover
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </VStack>
  );
};
