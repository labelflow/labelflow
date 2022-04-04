import { gql, useMutation, useQuery } from "@apollo/client";
import { useToast } from "@chakra-ui/react";
import { isEmpty } from "lodash/fp";
import { useRouter } from "next/router";
import React from "react";
import { CurrentUserCanAcceptInvitation } from "../../graphql-types/globalTypes";
import { useUser } from "../../hooks";
import { USER_QUERY } from "../../shared-queries/user.query";
import { getDisplayName } from "../members/user";
import { LayoutSpinner } from "../core";
import { AcceptOrDeclineMembershipInvitation } from "./accept-or-decline-membership-invitation";
import { InvalidInvitation } from "./invalid-invitation";

const INVITATION_DETAILS_QUERY = gql`
  query InvitationDetailsQuery($id: ID!) {
    membership(where: { id: $id }) {
      id
      currentUserCanAcceptInvitation
      invitationEmailSentTo
      workspace {
        id
        name
        slug
      }
    }
  }
`;

const ACCEPT_INVITATION_MUTATION = gql`
  mutation AcceptInvitationMutation($id: ID!) {
    acceptInvitation(where: { id: $id }) {
      id
    }
  }
`;

const DECLINE_INVITATION_MUTATION = gql`
  mutation DeclineInvitationMutation($id: ID!) {
    declineInvitation(where: { id: $id }) {
      id
    }
  }
`;

export const InvitationManager = () => {
  const toast = useToast();
  const { id: userId } = useUser();
  const router = useRouter();
  const { membershipId } = router.query;
  const { data, loading: invitationDetailsAreLoading } = useQuery(
    INVITATION_DETAILS_QUERY,
    {
      variables: { id: membershipId },
      skip: !membershipId,
    }
  );
  const membership = data?.membership;

  const [acceptInvitation, { called: hasAccepted }] = useMutation(
    ACCEPT_INVITATION_MUTATION,
    {
      variables: { id: membershipId },
      onCompleted: () => {
        toast({
          title: "Invitation accepted",
          description: `You have accepted the invitation to join the workspace ${membership?.workspace?.name}. You will be redirected to the workspace.`,
          status: "success",
          duration: 10000,
          isClosable: true,
          position: "bottom-right",
        });
        setTimeout(() => {
          router.push(`/${membership?.workspace?.slug}`);
        }, 5000);
      },
      onError: (error) => {
        toast({
          title: "Error accepting invitation",
          description: error.message,
          status: "error",
          duration: 10000,
          isClosable: true,
          position: "bottom-right",
        });
      },
    }
  );
  const [declineInvitation, { called: hasDeclined }] = useMutation(
    DECLINE_INVITATION_MUTATION,
    {
      variables: { id: membershipId },
      onCompleted: () => {
        toast({
          title: "Invitation declined",
          description: `You have declined the invitation to join the workspace ${membership?.workspace?.name}. You will be redirected to the Home Page.`,
          status: "success",
          duration: 10000,
          isClosable: true,
          position: "bottom-right",
        });
        setTimeout(() => {
          router.push(`/`);
        }, 5000);
      },
      onError: (error) => {
        toast({
          title: "Error declining invitation",
          description: error.message,
          status: "error",
          duration: 10000,
          isClosable: true,
          position: "bottom-right",
        });
      },
    }
  );

  const { data: userData, loading: userIsLoading } = useQuery(USER_QUERY, {
    variables: { id: userId },
    skip: isEmpty(userId),
  });
  const displayName = userData?.user
    ? getDisplayName(userData?.user)
    : "Anonymous";

  if (invitationDetailsAreLoading || userIsLoading) {
    return <LayoutSpinner />;
  }

  if (!membership) {
    return (
      <InvalidInvitation reason="Couldn't retrieve this invitation. It may have been revoked by the Workspace Administrator." />
    );
  }

  const { invitationEmailSentTo, workspace } = membership;

  switch (membership.currentUserCanAcceptInvitation) {
    case CurrentUserCanAcceptInvitation.Yes:
      return (
        <AcceptOrDeclineMembershipInvitation
          invitationEmailAddress={invitationEmailSentTo}
          workspaceName={workspace.name}
          currentUserIdentifier={displayName}
          accept={acceptInvitation}
          decline={declineInvitation}
          disabled={hasAccepted || hasDeclined}
        />
      );

    case CurrentUserCanAcceptInvitation.AlreadyAccepted:
      return (
        <InvalidInvitation reason="It looks like someone has already accepted this invitation. If it wasn't you, contact your Workspace Administrator." />
      );

    case CurrentUserCanAcceptInvitation.AlreadyDeclined:
      return (
        <InvalidInvitation reason="This invitation has already been declined. If it wasn't you, contact your Workspace Administrator." />
      );

    case CurrentUserCanAcceptInvitation.AlreadyMemberOfTheWorkspace:
      return (
        <InvalidInvitation
          reason={`You are already a member of the workspace "${workspace.name}". If you wanted to accept it with another account, you need to sign out first.`}
        />
      );

    default:
      throw new Error("CurrentUserCanAcceptInvitation has an incorrect value.");
  }
};
