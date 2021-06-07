import { ChangeEvent, useState } from "react";
import { Stack, VStack, Button, Textarea } from "@chakra-ui/react";
import { isWebUri } from "valid-url";

import { DroppedUrl } from "../types";

export const UrlList = ({
  onDropEnd,
}: {
  onDropEnd: (images: Array<DroppedUrl>) => void;
}) => {
  const [value, setValue] = useState<string>(
    "https://images.unsplash.com/photo-1593642634443-44adaa06623a?auto=format&fit=crop&w=600&q=80\nhttps://images.unsplash.com/photo-1611095790444-1dfa35e37b52?auto=format&fit=crop&w=600&q=80\nhttps://images.unsplash.com/photo-1622832148332-b436648cef62?auto=format&fit=crop&w=600&q=80"
  );

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    setValue(inputValue);
  };

  return (
    <VStack spacing={4} flex="1" alignItems="stretch">
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
          placeholder="Enter your urls here, one per line\nE.g:\nhttp://"
          size="sm"
          h="full"
          resize="none"
        />
      </Stack>
      <Button
        onClick={() => {
          onDropEnd(
            value.split("\n").map((url) => {
              if (!isWebUri(url)) {
                return { url, errors: [new Error("Invalid URL")] };
              }
              return { url, errors: [] };
            })
          );
        }}
      >
        Start Import
      </Button>
    </VStack>
  );
};
