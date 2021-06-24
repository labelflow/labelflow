import { ChangeEvent, useState } from "react";
import { Stack, VStack, Button, Textarea } from "@chakra-ui/react";
import { isWebUri } from "valid-url";
import { isEmpty, uniq } from "lodash/fp";
import { DroppedUrl } from "../types";
import imageSampleCollection from "../../../../utils/image-sample-collection";

export const UrlList = ({
  onDropEnd,
}: {
  onDropEnd: (images: Array<DroppedUrl>) => void;
}) => {
  const [value, setValue] = useState<string>("");

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    setValue(inputValue);
  };

  return (
    <VStack spacing={4} flex="1" alignItems="stretch">
      <Button mt={2} onClick={() => setValue(imageSampleCollection.join("\n"))}>
        Insert example images
      </Button>
      <Stack
        as="form"
        border="1px dashed"
        borderColor="gray.700"
        borderRadius="md"
        bg="gray.50"
        flex="1"
      >
        <Textarea
          borderRadius="md"
          border="none"
          value={value}
          onChange={handleInputChange}
          placeholder="Enter your image URLs here, one per line. Example:&#13;&#10;https://example.com/image1.jpeg&#13;&#10;https://example.com/image2.jpeg"
          size="sm"
          h="full"
          resize="none"
        />
      </Stack>
      <Button
        onClick={() => {
          onDropEnd(
            uniq(value.split("\n").filter((line) => !isEmpty(line))).map(
              (url) => {
                if (!isWebUri(url)) {
                  return { url, errors: [new Error("Invalid URL")] };
                }
                return { url, errors: [] };
              }
            )
          );
        }}
      >
        Start Import
      </Button>
    </VStack>
  );
};
