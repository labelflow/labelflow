import { gql } from "@apollo/client";

/* ----------------------------------------------------------------- */
/*                              WARNING                              */
/*                                                                   */
/* Be careful when you modify those queries! In general, it may not  */
/* be a good idea to share the same queries across different places  */
/* It is generally highly preferred to make each query specific to   */
/* your use-case and only query what you need.                       */
/* The following queries are shared across effects and have specific */
/* payload request to work with optimistic responses and cache       */
/* updates. So bear, in mind that modifying any of the following     */
/* query will certainly have consequences on their related           */
/* optimistic responses and caches updates.                          */
/* ----------------------------------------------------------------- */

export const IMAGE_DIMENSIONS_QUERY = gql`
  query ImageDimensionsQuery($id: ID!) {
    image(where: { id: $id }) {
      id
      width
      height
    }
  }
`;

export const CREATED_LABEL_FRAGMENT = gql`
  fragment NewLabel on Label {
    id
    x
    y
    width
    height
    smartToolInput
    type
    labelClass {
      id
    }
    geometry {
      type
      coordinates
    }
  }
`;

export const CREATE_LABEL_CLASS_QUERY = gql`
  mutation CreateLabelClassActionMutation($data: LabelClassCreateInput!) {
    createLabelClass(data: $data) {
      id
      name
      color
    }
  }
`;

export const DELETE_LABEL_CLASS_MUTATION = gql`
  mutation DeleteLabelClassActionMutation($where: LabelClassWhereUniqueInput!) {
    deleteLabelClass(where: $where) {
      id
    }
  }
`;

export const CREATE_LABEL_MUTATION = gql`
  mutation CreateLabelActionMutation($data: LabelCreateInput!) {
    createLabel(data: $data) {
      id
    }
  }
`;

export const DELETE_LABEL_MUTATION = gql`
  mutation DeleteLabelActionMutation($id: ID!) {
    deleteLabel(where: { id: $id }) {
      id
    }
  }
`;

export const GET_LABEL_QUERY = gql`
  query GetLabelIdAndClassIdQuery($id: ID!) {
    label(where: { id: $id }) {
      id
      labelClass {
        id
      }
    }
  }
`;

export const UPDATE_LABEL_MUTATION = gql`
  mutation UpdateLabelClassActionMutation(
    $where: LabelWhereUniqueInput!
    $data: LabelUpdateInput!
  ) {
    updateLabel(where: $where, data: $data) {
      id
      labelClass {
        id
      }
    }
  }
`;
