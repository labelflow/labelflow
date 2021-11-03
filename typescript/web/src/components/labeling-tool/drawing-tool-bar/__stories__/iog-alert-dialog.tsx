import React, { useState } from "react";

import { useToast, Button } from "@chakra-ui/react";

import { chakraDecorator } from "../../../../utils/chakra-decorator";
import { queryParamsDecorator } from "../../../../utils/query-params-decorator";

import { IogAlertDialog } from "../iog-alert-dialog";

export default {
  title: "web/Drawing Toolbar/Iog Alert Dialog",
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
