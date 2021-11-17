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

export const imageDimensionsQuery = gql`
  query imageDimensions($id: ID!) {
    image(where: { id: $id }) {
      id
      width
      height
    }
  }
`;

export const createdLabelFragment = gql`
  fragment NewLabel on Label {
    id
    x
    y
    width
    height
    labelClass {
      id
    }
    geometry {
      type
      coordinates
    }
  }
`;
