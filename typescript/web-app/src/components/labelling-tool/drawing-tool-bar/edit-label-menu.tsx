import { useMemo } from "react";
import { useQuery, useApolloClient, ApolloClient } from "@apollo/client";
import gql from "graphql-tag";

import { ClassSelectionMenu } from "../../class-selection-menu";
import { useLabellingStore } from "../../../connectors/labelling-state";
import {
  getNextClassColor,
  hexColorSequence,
} from "../../../utils/class-color-generator";
import { useUndoStore, Effect } from "../../../connectors/undo-store";
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

const labelClassQuery = gql`
  query getLabelClass($id: ID!) {
    labelClass(where: { id: $id }) {
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

const createCreateLabelClassEffect = (
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

const createNewClassCurry =
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

const createUpdateLabelClassEffect = ({
  selectedLabelClassId,
  selectedLabelClassIdPrevious,
}: {
  selectedLabelClassId: string | null;
  selectedLabelClassIdPrevious: string | null;
}): Effect => ({
  do: async () => {
    useLabellingStore.setState({ selectedLabelClassId });
  },
  undo: async () => {
    useLabellingStore.setState({ selectedLabelClassIdPrevious });
  },
});

export const EditLabelMenu = () => {
  const client = useApolloClient();
  const { data } = useQuery(labelClassesQuery);
  const { perform } = useUndoStore();
  const labelClasses = data?.labelClasses ?? [];
  const selectedLabelId = useLabellingStore((state) => state.selectedLabelId);
  const selectedLabelClassId = useLabellingStore(
    (state) => state.selectedLabelClassId
  );
  const { data: dataLabelClass } = useQuery(labelClassQuery, {
    variables: { id: selectedLabelClassId },
  });
  const selectedLabelClass = dataLabelClass?.labelClass;
  const createNewClass = useMemo(
    () =>
      createNewClassCurry({
        labelClasses,
        perform,
        client,
      }),
    [labelClasses]
  );

  return (
    <ClassSelectionMenu
      selectedLabelClass={selectedLabelClass}
      labelClasses={labelClasses}
      createNewClass={async (name) => createNewClass(name, selectedLabelId)}
      onSelectedClassChange={(item) => {
        perform(
          createUpdateLabelClassEffect({
            selectedLabelClassId: item?.id ?? null,
            selectedLabelClassIdPrevious: selectedLabelClassId,
          })
        );
      }}
    />
  );
};
