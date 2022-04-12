import { Button, useToast } from "@chakra-ui/react";
import { Story } from "@storybook/react";
import React, { useState } from "react";
import {
  chakraDecorator,
  CYPRESS_SCREEN_WIDTH,
  fixedScreenDecorator,
  queryParamsDecorator,
  storybookTitle,
} from "../../../utils/stories";
import { IogAlertDialog as IogAlertDialogComponent } from "./iog-alert-dialog";

export default {
  title: storybookTitle(
    "Labeling tool",
    "Drawing toolbar",
    IogAlertDialogComponent
  ),
  component: IogAlertDialogComponent,
  decorators: [chakraDecorator, queryParamsDecorator, fixedScreenDecorator],
  parameters: {
    nextRouter: {
      path: "/images/[id]",
      asPath: "/images/mock-image-id",
      query: {
        id: "mock-image-id",
      },
    },
    chromatic: { viewports: [CYPRESS_SCREEN_WIDTH] },
  },
};

export const IogAlertDialog: Story = () => {
  const [isDialogOpened, setIsDialogOpened] = useState(true);
  const toast = useToast();
  return (
    <>
      <IogAlertDialogComponent
        isOpen={isDialogOpened}
        onAccept={() => toast({ description: "Accepted" })}
        onClose={() => setIsDialogOpened(false)}
      />
      <Button onClick={() => setIsDialogOpened(true)}>Open</Button>
    </>
  );
};
