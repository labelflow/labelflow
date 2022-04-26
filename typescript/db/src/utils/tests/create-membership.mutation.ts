import { gql } from "@apollo/client";
import {
  Membership,
  MutationCreateMembershipArgs,
} from "@labelflow/graphql-types";
import { client } from "../../dev/apollo-client";

export const CREATE_MEMBERSHIP_MUTATION = gql`
  mutation createMembership($data: MembershipCreateInput!) {
    createMembership(data: $data) {
      id
      role
    }
  }
`;

export const createMembership = (data?: MutationCreateMembershipArgs["data"]) =>
  client.mutate<{
    createMembership: Membership;
  }>({
    mutation: CREATE_MEMBERSHIP_MUTATION,
    variables: { data },
  });
