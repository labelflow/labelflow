import { Button, useToast } from "@chakra-ui/react";
import { Story } from "@storybook/react";
import React, { useState } from "react";
import {
  chakraDecorator,
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
  parameters: {
    nextRouter: {
      path: "/images/[id]",
      asPath: "/images/mock-image-id",
      query: {
        id: "mock-image-id",
      },
    },
  },
  decorators: [chakraDecorator, queryParamsDecorator],
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
