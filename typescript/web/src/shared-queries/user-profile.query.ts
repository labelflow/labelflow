import { gql } from "@apollo/client";

// This query is used across the whole app as long as the user menu is shown
export const USER_PROFILE_QUERY = gql`
  query UserProfileQuery($id: ID!) {
    user(where: { id: $id }) {
      id
      createdAt
      name
      email
      image
    }
  }
`;
