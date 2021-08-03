import { gql, ApolloClient } from "@apollo/client";

import { LabelClass } from "@labelflow/graphql-types";
import { useLabellingStore } from "../../labelling-state";
import {
  getNextClassColor,
  hexColorSequence,
} from "../../../utils/class-color-generator";
import { Effect } from "..";
import { getProjectsQuery } from "../../../pages/projects";
import { projectLabelClassesQuery } from "../../../components/project-class-list/class-item";

const labelClassesOfProjectQuery = gql`
  query getLabelClassesOfProject($projectId: ID!) {
    labelClasses(where: { projectId: $projectId }) {
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
    projectId,
    selectedLabelClassIdPrevious,
  }: {
    name: string;
    color: string;
    projectId: string;
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
      variables: { data: { name, color, projectId } },
      refetchQueries: [
        { query: labelClassesOfProjectQuery, variables: { projectId } },
        { query: getProjectsQuery },
        { query: projectLabelClassesQuery, variables: { projectId } },
      ],
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
      refetchQueries: [
        { query: labelClassesOfProjectQuery, variables: { projectId } },
        { query: getProjectsQuery },
        { query: projectLabelClassesQuery, variables: { projectId } },
      ],
    });

    useLabellingStore.setState({
      selectedLabelClassId: selectedLabelClassIdPrevious,
    });

    return labelClassId;
  },
  redo: async (labelClassId: string) => {
    await client.mutate({
      mutation: createLabelClassQuery,
      variables: { data: { name, color, id: labelClassId, projectId } },
      refetchQueries: [
        { query: labelClassesOfProjectQuery, variables: { projectId } },
        { query: getProjectsQuery },
        { query: projectLabelClassesQuery, variables: { projectId } },
      ],
    });

    useLabellingStore.setState({ selectedLabelClassId: labelClassId });

    return labelClassId;
  },
});

export const createNewLabelClassCurry =
  ({
    labelClasses,
    projectId,
    perform,
    client,
  }: {
    labelClasses: LabelClass[];
    projectId: string;
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
        { name, color: newClassColor, selectedLabelClassIdPrevious, projectId },
        { client }
      )
    );
  };
