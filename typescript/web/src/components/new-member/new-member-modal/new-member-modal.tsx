import { useEffect, useState, ChangeEvent } from "react";
import {
  Flex,
  Alert,
  AlertIcon,
  AlertDescription,
  VStack,
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
import { RoleSelection } from "../../members/role-selection";
import { Role } from "../../members/types";

const validateEmail = (email: string): boolean => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};
const maxNumberOfEmails = 20;

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
  const [role, setRole] = useState<Role>("Owner");
  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    setValue(inputValue);
  };
  const emails = value.split("\n").filter((email) => email !== "");
  const hasInvalidEmails = emails.some((email) => !validateEmail(email));

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
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader textAlign="center" padding="6">
          <Heading as="h2" size="lg" pb="2">
            Invite members
          </Heading>
          <Text fontSize="lg" fontWeight="medium">
            Adding members to the workspace will give them access to{" "}
            <b>every dataset</b> in the workspace.
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
          <VStack alignItems="stretch">
            <Flex flexDirection="column">
              <Text fontSize="md" fontWeight="bold" marginBottom={2}>
                Emails:
              </Text>
              <Textarea
                border="1px"
                borderColor={mode("gray.200", "gray.400")}
                borderRadius="md"
                bg="transparent"
                value={value}
                onChange={handleInputChange}
                placeholder="user1@example.com&#13;&#10;user2@example.com&#13;&#10;..."
                size="sm"
                height="3xs"
                resize="none"
              />
              <Text
                fontSize="xs"
                fontWeight="medium"
                color={`${
                  emails.length > maxNumberOfEmails || hasInvalidEmails
                    ? "red"
                    : "black"
                }`}
              >
                {`${emails.length} ${
                  emails.length <= 1 ? "Invitee." : "Invitees."
                } ${
                  emails.length > maxNumberOfEmails
                    ? ` You can invite a maximum of ${maxNumberOfEmails} members at a time.`
                    : ""
                } ${
                  hasInvalidEmails
                    ? "\nInvalid emails found, please check them."
                    : ""
                }`}
              </Text>
            </Flex>
            <Flex paddingTop={4} flexDirection="column">
              <Text fontSize="md" fontWeight="bold" marginBottom={2}>
                Invite as:
              </Text>
              <RoleSelection role={role} changeMembershipRole={setRole} />
            </Flex>
            <Flex paddingTop={4}>
              <Alert status="info" borderRadius={5}>
                <AlertIcon />
                <AlertDescription fontSize={13} fontWeight="medium">
                  <b>Tip</b>: Until January 2022 the number of members in a
                  Shared Workspace is not limited, the time for us to collect
                  your{" "}
                  <Link
                    target="_blank"
                    href="https://discord.gg/NyYQ4dM3Dj"
                    color="blue.600"
                    textDecoration="underline"
                  >
                    feedbacks
                  </Link>
                  .
                </AlertDescription>
              </Alert>
            </Flex>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="brand"
            size="md"
            alignSelf="flex-end"
            disabled={
              emails.length === 0 ||
              emails.length > maxNumberOfEmails ||
              hasInvalidEmails
            }
            flexShrink={0}
            onClick={() => {
              onClose();
              setValue("");
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
