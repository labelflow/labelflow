import { Tooltip, Text } from "@chakra-ui/react";
import { FileError } from "react-dropzone";

export const ImportError = ({ errors }: { errors: Array<Error> }) => {
  if (errors.length === 1) {
    return (
      <Tooltip label={errors[0].message} placement="left">
        <Text as="span">
          {(errors[0] as unknown as FileError)?.code === "file-invalid-type"
            ? "File type must be jpeg, png or bmp"
            : errors[0].message}
        </Text>
      </Tooltip>
    );
  }

  return (
    <Tooltip label={errors.map((e) => e.message).join(". ")} placement="left">
      <Text as="span" color="red.600">
        {errors.length} errors
      </Text>
    </Tooltip>
  );
};
