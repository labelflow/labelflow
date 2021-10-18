import { useState, ChangeEvent } from "react";
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
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { InvitationStatus } from "../../utils/email/types";

import { RoleSelection } from "./role-selection";
import { Role } from "./types";

const validateEmail = (email: string): boolean => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};
const maxNumberOfEmails = 20;
type EmailStatuses = Record<InvitationStatus, string[]>;

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
}: {
  isOpen?: boolean;
  onClose?: () => void;
}) => {
  const router = useRouter();
  const toast = useToast();
  const { data: session } = useSession({ required: false });
  const { workspaceSlug } = router?.query;
  const [value, setValue] = useState<string>("");
  const [role, setRole] = useState<Role>("Owner");
  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    setValue(inputValue);
  };
  const emails = value.split("\n").filter((email) => email !== "");
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
                    ? "\nAt lease one email format is invalid. Write one email address per line."
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
            onClick={async () => {
              onClose();
              const { origin } = new URL(window.location.href);
              const statuses = await emails.reduce(
                async (statusesPromise, email) => {
                  const statusesCurrent = await statusesPromise;
                  const inputsInvitation = {
                    ...{
                      inviteeEmail: email,
                      inviteeRole: role,
                      workspaceSlug: workspaceSlug as string,
                    },
                    ...(session?.user?.email && {
                      inviterEmail: session?.user?.email,
                    }),
                    ...(session?.user?.name && {
                      inviterName: session?.user?.name,
                    }),
                  };
                  const searchParams = new URLSearchParams(inputsInvitation);
                  const { status } = (await (
                    await fetch(
                      `${origin}/api/email/send-invitation?${searchParams.toString()}`
                    )
                  ).json()) as unknown as { status: InvitationStatus };
                  statusesCurrent[status].push(email);
                  return statusesCurrent;
                },
                new Promise((resolve) => {
                  resolve({
                    0: [],
                    1: [],
                    2: [],
                  });
                }) as Promise<EmailStatuses>
              );
              if (statuses[InvitationStatus.Sent].length > 0) {
                toast({
                  title: `${statuses[InvitationStatus.Sent].length} Invitation${
                    statuses[InvitationStatus.Sent].length > 1 ? "s" : ""
                  } sent.`,
                  description: `${summarizeEmailList(
                    statuses[InvitationStatus.Sent]
                  )} ${
                    statuses[InvitationStatus.Sent].length > 1 ? "were" : "was"
                  } successfully invited to this workspace.`,
                  status: "success",
                  duration: 9000,
                  isClosable: true,
                  position: "bottom-right",
                });
              }
              if (statuses[InvitationStatus.UserAlreadyIn].length > 0) {
                toast({
                  title: `${
                    statuses[InvitationStatus.UserAlreadyIn].length
                  } Invitation${
                    statuses[InvitationStatus.UserAlreadyIn].length > 1
                      ? "s"
                      : ""
                  } not sent.`,
                  description: `${summarizeEmailList(
                    statuses[InvitationStatus.UserAlreadyIn]
                  )} ${
                    statuses[InvitationStatus.Sent].length > 1 ? "were" : "was"
                  } already member${
                    statuses[InvitationStatus.Sent].length > 1 ? "s" : ""
                  } of this workspace.`,
                  status: "warning",
                  duration: 9000,
                  isClosable: true,
                  position: "bottom-right",
                });
              }
              if (statuses[InvitationStatus.Error].length > 0) {
                toast({
                  title: `${statuses[InvitationStatus.Error].length} Error${
                    statuses[InvitationStatus.Error].length > 1 ? "s" : ""
                  } encountered.`,
                  description: `Encountered an error when sending invitation to ${summarizeEmailList(
                    statuses[InvitationStatus.Error]
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
