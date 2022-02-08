import { Button, useToast } from "@chakra-ui/react";
import React, { useState } from "react";
import {
  chakraDecorator,
  queryParamsDecorator,
  storybookTitle,
} from "../../../utils/stories";
import { IogAlertDialog } from "./iog-alert-dialog";

export default {
  title: storybookTitle("Drawing toolbar", IogAlertDialog),
  component: IogAlertDialog,
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

// @ts-ignore
export const Default = () => {
  const [isDialogOpened, setIsDialogOpened] = useState(true);
  const toast = useToast();
  return (
    <>
      <IogAlertDialog
        isOpen={isDialogOpened}
        onAccept={() => toast({ description: "Accepted" })}
        onClose={() => setIsDialogOpened(false)}
      />
      <Button onClick={() => setIsDialogOpened(true)}>Open</Button>
    </>
  );
};
