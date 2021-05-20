import { Button, useDisclosure } from "@chakra-ui/react";
import { ImportImagesModal } from "./import-images-modal";

export default {
  title: "Import images modal",
};

export const Default = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div>
      <Button onClick={onOpen}>Display</Button>
      <ImportImagesModal
        isOpen={isOpen}
        onClose={onClose}
        onImportSucceed={(acceptedFiles) => console.log(acceptedFiles)}
      />
    </div>
  );
};

export const WithFiles = () => {
  const files = [
    new File(["Hello"], "hello.png", { type: "image/png" }),
    new File(["World"], "world.png", { type: "image/png" }),
    new File(["Hello"], "hello.png", { type: "image/png" }),
    new File(["World"], "world.png", { type: "image/png" }),
    new File(["Hello"], "hello.png", { type: "image/png" }),
    new File(["World"], "world.png", { type: "image/png" }),
    new File(["Hello"], "hello.png", { type: "image/png" }),
    new File(["World"], "world.png", { type: "image/png" }),
    new File(["Hello"], "hello.png", { type: "image/png" }),
    new File(["World"], "world.png", { type: "image/png" }),
    new File(["Hello"], "hello.png", { type: "image/png" }),
    new File(["World"], "world.png", { type: "image/png" }),
    new File(["Hello"], "hello.png", { type: "image/png" }),
    new File(["World"], "world.png", { type: "image/png" }),
    new File(["Hello"], "hello.png", { type: "image/png" }),
    new File(["World"], "world.png", { type: "image/png" }),
  ].map((f: any) => {
    f.path = f.name;

    return f;
  });

  return (
    <div>
      <ImportImagesModal
        isOpen
        onClose={() => {}}
        onImportSucceed={(acceptedFiles) => console.log(acceptedFiles)}
        initialAcceptedFiles={files}
      />
    </div>
  );
};
