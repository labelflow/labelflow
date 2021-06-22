import { ApolloClient } from "@apollo/client";
import gql from "graphql-tag";

import { useLabellingStore } from "../../labelling-state";
import {
  getNextClassColor,
  hexColorSequence,
} from "../../../utils/class-color-generator";
import { Effect } from "..";
import { LabelClass } from "../../../graphql-types.generated";

const labelClassesQuery = gql`
  query getLabelClasses {
    labelClasses {
      id
      name
      color
    }
  }
`;

const createLabelClassQuery = gql`
  mutation createLabelClass($data: LabelClassCreateInput!) {
    createLabelClass(data: $data) {
      id
    }
  }
`;

const deleteLabelClassQuery = gql`
  mutation deleteLabelClass($where: LabelClassWhereUniqueInput!) {
    deleteLabelClass(where: $where) {
      id
    }
  }
`;

export const createCreateLabelClassEffect = (
  {
    name,
    color,
    selectedLabelClassIdPrevious,
  }: {
    name: string;
    color: string;
    selectedLabelClassIdPrevious: string | null;
  },
  {
    client,
  }: {
    client: ApolloClient<object>;
  }
): Effect => ({
  do: async () => {
    const {
      data: {
        createLabelClass: { id: labelClassId },
      },
    } = await client.mutate({
      mutation: createLabelClassQuery,
      variables: { data: { name, color } },
      refetchQueries: [{ query: labelClassesQuery }],
    });

    useLabellingStore.setState({ selectedLabelClassId: labelClassId });

    return labelClassId;
  },
  undo: async (labelClassId: string) => {
    await client.mutate({
      mutation: deleteLabelClassQuery,
      variables: {
        where: { id: labelClassId },
      },
      refetchQueries: [{ query: labelClassesQuery }],
    });

    useLabellingStore.setState({
      selectedLabelClassId: selectedLabelClassIdPrevious,
    });

    return labelClassId;
  },
  redo: async (labelClassId: string) => {
    await client.mutate({
      mutation: createLabelClassQuery,
      variables: { data: { name, color, id: labelClassId } },
      refetchQueries: [{ query: labelClassesQuery }],
    });

    useLabellingStore.setState({ selectedLabelClassId: labelClassId });

    return labelClassId;
  },
});

export const createNewLabelClassCurry =
  ({
    labelClasses,
    perform,
    client,
  }: {
    labelClasses: LabelClass[];
    perform: any;
    client: ApolloClient<object>;
  }) =>
  async (name: string, selectedLabelClassIdPrevious: string | null) => {
    const newClassColor =
      labelClasses.length < 1
        ? hexColorSequence[0]
        : getNextClassColor(labelClasses[labelClasses.length - 1].color);
    perform(
      createCreateLabelClassEffect(
        { name, color: newClassColor, selectedLabelClassIdPrevious },
        { client }
      )
    );
  };
