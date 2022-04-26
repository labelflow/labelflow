import { ChangeEvent, useState } from "react";
import { FaDev } from "react-icons/fa";
import {
  Stack,
  VStack,
  Button,
  Textarea,
  chakra,
  useColorModeValue,
} from "@chakra-ui/react";
import { isWebUri } from "valid-url";
import { isEmpty, uniq } from "lodash/fp";
import { DroppedUrl } from "../types";
import imageSampleCollection from "../../../../utils/image-sample-collection";
import { isDevelopmentEnvironment } from "../../../../utils/detect-scope";

const DevIcon = chakra(FaDev);

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

  const examplesButtonBackground = useColorModeValue("pink.200", "pink.700");

  return (
    <VStack spacing={4} flex="1" alignItems="stretch">
      {isDevelopmentEnvironment && (
        <Button
          mt={2}
          leftIcon={<DevIcon size="1.5rem" />}
          onClick={() => setValue(imageSampleCollection.join("\n"))}
          background={examplesButtonBackground}
        >
          Insert example images
        </Button>
      )}
      <Stack
        as="form"
        border="1px dashed"
        borderColor={useColorModeValue("gray.700", "gray.400")}
        borderRadius="md"
        bg={useColorModeValue("gray.50", "gray.800")}
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
