import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Flex,
  Heading,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { isEmpty } from "lodash/fp";
import { ChangeEvent, useState } from "react";
import {
  InvitationResult,
  MembershipRole,
} from "../../graphql-types/globalTypes";
import { useWorkspace } from "../../hooks";
import { validateEmail } from "../../utils/validate-email";
import { RoleSelection } from "./role-selection";
import { InviteMember } from "./types";

const maxNumberOfEmails = 20;
type EmailStatuses = Record<InvitationResult, string[]>;

const parseEmails = (text: string): string[] => {
  return text.split(/[,;\s]/).filter((email) => !isEmpty(email));
};

const summarizeEmailList = (emailList: string[]): string => {
  if (emailList.length === 1) {
    return `${emailList[0]}`;
  }
  if (emailList.length === 2) {
    return `${emailList[0]} and ${emailList[1]}
    `;
  }
  return `${emailList[0]}, ${emailList[1]} and ${emailList.length - 2} others
    `;
};

export const NewMemberModal = ({
  isOpen = false,
  onClose = () => {},
  inviteMember = async () => InvitationResult.Sent,
}: {
  isOpen?: boolean;
  onClose?: () => void;
  inviteMember?: InviteMember;
}) => {
  const toast = useToast();
  const { slug: workspaceSlug } = useWorkspace();
  const [value, setValue] = useState<string>("");
  const [role, setRole] = useState<MembershipRole>(MembershipRole.Owner);
  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    setValue(inputValue);
  };
  const emails = parseEmails(value);
  const hasInvalidEmails = emails.some((email) => !validateEmail(email));

  return (
    <Modal
      isOpen={isOpen}
      size="xl"
      scrollBehavior="inside"
      onClose={() => {
        onClose();
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
            Adding members will give them access to <b>every dataset</b> in the
            workspace.
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
                borderColor={useColorModeValue("gray.200", "gray.400")}
                borderRadius="md"
                bg="transparent"
                value={value}
                onChange={handleInputChange}
                placeholder={`user1@example.com
user2@example.com
...`}
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
                    ? "\nAt least one email address is invalid. Addresses can be separated by new lines, spaces, commas or semicolons."
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
                  <b>Tip</b>: Until March 2022 the number of members in a Shared
                  Workspace is not limited, the time for us to collect your{" "}
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
            onClick={async () => {
              onClose();
              const statuses = await emails.reduce(
                async (statusesPromise, email) => {
                  const statusesCurrent = await statusesPromise;
                  const status = await inviteMember({
                    email,
                    role,
                    workspaceSlug,
                  });
                  statusesCurrent[status].push(email);
                  return statusesCurrent;
                },
                new Promise((resolve) => {
                  resolve({
                    [InvitationResult.Error]: [],
                    [InvitationResult.Sent]: [],
                    [InvitationResult.UserAlreadyIn]: [],
                  });
                }) as Promise<EmailStatuses>
              );
              if (statuses[InvitationResult.Sent].length > 0) {
                toast({
                  title: `${statuses[InvitationResult.Sent].length} Invitation${
                    statuses[InvitationResult.Sent].length > 1 ? "s" : ""
                  } sent.`,
                  description: `${summarizeEmailList(
                    statuses[InvitationResult.Sent]
                  )} ${
                    statuses[InvitationResult.Sent].length > 1 ? "were" : "was"
                  } successfully invited to this workspace.`,
                  status: "success",
                  duration: 9000,
                  isClosable: true,
                  position: "bottom-right",
                });
              }
              if (statuses[InvitationResult.UserAlreadyIn].length > 0) {
                toast({
                  title: `${
                    statuses[InvitationResult.UserAlreadyIn].length
                  } Invitation${
                    statuses[InvitationResult.UserAlreadyIn].length > 1
                      ? "s"
                      : ""
                  } not sent.`,
                  description: `${summarizeEmailList(
                    statuses[InvitationResult.UserAlreadyIn]
                  )} ${
                    statuses[InvitationResult.Sent].length > 1 ? "were" : "was"
                  } already member${
                    statuses[InvitationResult.Sent].length > 1 ? "s" : ""
                  } of this workspace.`,
                  status: "warning",
                  duration: 9000,
                  isClosable: true,
                  position: "bottom-right",
                });
              }
              if (statuses[InvitationResult.Error].length > 0) {
                toast({
                  title: `${statuses[InvitationResult.Error].length} Error${
                    statuses[InvitationResult.Error].length > 1 ? "s" : ""
                  } encountered.`,
                  description: `Encountered an error when sending invitation to ${summarizeEmailList(
                    statuses[InvitationResult.Error]
                  )}. Please check the email addresses.`,
                  status: "error",
                  duration: 9000,
                  isClosable: true,
                  position: "bottom-right",
                });
              }
              setValue("");
            }}
          >
            Send
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
