import { ChangeEvent, useState } from "react";
import {
  Stack,
  VStack,
  Button,
  Textarea,
  useColorModeValue as mode,
  Text,
  Select,
} from "@chakra-ui/react";
import { isWebUri } from "valid-url";
import { isEmpty, uniq } from "lodash/fp";
import { DroppedUrl } from "../types";

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
    <VStack spacing={2} flex="1" alignItems="stretch">
      <Text fontSize="md" fontWeight="bold">
        Emails:
      </Text>
      <Stack
        as="form"
        border="1px"
        borderColor={mode("gray.100", "gray.400")}
        borderRadius="md"
        bg="transparent"
        flex="1"
      >
        <Textarea
          borderRadius="md"
          border="none"
          value={value}
          onChange={handleInputChange}
          placeholder="user1@example.com&#13;&#10;user2@example.com&#13;&#10;..."
          size="sm"
          h="full"
          resize="none"
        />
      </Stack>
      <Text fontSize="sm" fontWeight="medium">
        Invitees
      </Text>
      <Text fontSize="md" fontWeight="bold" paddingTop={2}>
        Invite as:
      </Text>
      <Select>
        <option value="owner">
          <Text color="gray.100">
            Owner- manage datasets, members and billing
          </Text>
        </option>
      </Select>
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
        Send
      </Button>
    </VStack>
  );
};
