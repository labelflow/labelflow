import { useEffect, useState, ChangeEvent } from "react";
import {
  Alert,
  AlertIcon,
  AlertDescription,
  Stack,
  VStack,
  Select,
  Text,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalFooter,
  Button,
  Heading,
  ModalHeader,
  ModalBody,
  useColorModeValue as mode,
  Link,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
// import { useQueryParam, StringParam, withDefault } from "use-query-params";
import { useApolloClient } from "@apollo/client";
import { datasetDataQuery } from "../../../pages/[workspaceSlug]/datasets/[datasetSlug]/images";
import { getDatasetsQuery } from "../../../pages/[workspaceSlug]/datasets";

export const NewMemberModal = ({
  isOpen = false,
  onClose = () => {},
}: {
  isOpen?: boolean;
  onClose?: () => void;
}) => {
  const client = useApolloClient();
  const router = useRouter();
  const { datasetSlug, workspaceSlug } = router?.query;

  const [hasUploaded, setHasUploaded] = useState(false);
  const [value, setValue] = useState<string>("");

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    setValue(inputValue);
  };

  useEffect(() => {
    // Manually refetch
    if (hasUploaded) {
      client.query({
        query: datasetDataQuery,
        variables: {
          slug: datasetSlug,
          workspaceSlug,
        },
        fetchPolicy: "network-only",
      });
      client.query({ query: getDatasetsQuery, fetchPolicy: "network-only" });
    }
  }, [hasUploaded]);

  return (
    <Modal
      isOpen={isOpen}
      size="xl"
      scrollBehavior="inside"
      onClose={() => {
        onClose();
        setHasUploaded(false);
      }}
      isCentered
    >
      <ModalOverlay />
      <ModalContent height="80vh">
        <ModalCloseButton />
        <ModalHeader textAlign="center" padding="6">
          <Heading as="h2" size="lg" pb="2">
            Invite members
          </Heading>
          <Text fontSize="lg" fontWeight="medium">
            Adding workspace members will give them access to{" "}
            <b>every datasets</b> in the workspace.
          </Text>
        </ModalHeader>

        <ModalBody
          display="flex"
          pt="0"
          pb="6"
          pr="6"
          pl="6"
          flexDirection="column"
        >
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
              {`${value.split("\n").length - 1} Invitees`}
            </Text>
            <Text fontSize="md" fontWeight="bold" paddingTop={2}>
              Invite as:
            </Text>
            <Select>
              <option value="owner">
                Owner - manage datasets, members and billing
              </option>
            </Select>
            <Alert status="info" borderRadius={5}>
              <AlertIcon />
              {/* <AlertTitle mr={2} fontSize={15} whiteSpace="nowrap">
                
              </AlertTitle> */}
              <AlertDescription fontSize={13} fontWeight="medium">
                <b>Tip</b>: Until January 2022 the number of members in a Shared
                Workspace is not limited, the time for us to collect your{" "}
                <Link
                  href="google.com"
                  color="blue.600"
                  textDecoration="underline"
                >
                  feedbacks
                </Link>
                .
              </AlertDescription>
            </Alert>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="brand"
            size="md"
            alignSelf="flex-end"
            flexShrink={0}
            onClick={() => {
              onClose();
              setHasUploaded(false);
            }}
          >
            Send
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
