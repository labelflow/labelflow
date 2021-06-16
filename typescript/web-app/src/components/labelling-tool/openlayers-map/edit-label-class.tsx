import { forwardRef } from "react";
import {
  useMutation,
  useQuery,
  useApolloClient,
  ApolloClient,
} from "@apollo/client";
import gql from "graphql-tag";

import { ClassSelectionPopover } from "../../class-selection-popover";
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

const labelQuery = gql`
  query getLabel($id: ID!) {
    label(where: { id: $id }) {
      id
      labelClass {
        id
      }
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

const updateLabelQuery = gql`
  mutation updateLabelClass(
    $where: LabelWhereUniqueInput!
    $data: LabelUpdateInput!
  ) {
    updateLabel(where: $where, data: $data) {
      id
    }
  }
`;

const createCreateLabelClassEffect = (
  {
    name,
    color,
    selectedLabelId,
  }: { name: string; color: string; selectedLabelId: string | null },
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

    const {
      data: {
        label: { labelClass },
      },
    } = await client.query({
      query: labelQuery,
      variables: { id: selectedLabelId },
    });

    const labelClassIdPrevious = labelClass?.id ?? null;

    await client.mutate({
      mutation: updateLabelQuery,
      variables: {
        where: { id: selectedLabelId },
        data: { labelClassId: labelClassId ?? null },
      },
      refetchQueries: ["getImageLabels"],
    });

    return {
      labelClassId,
      labelClassIdPrevious,
    };
  },
  undo: async ({
    labelClassId,
    labelClassIdPrevious,
  }: {
    labelClassId: string;
    labelClassIdPrevious: string;
  }) => {
    await client.mutate({
      mutation: updateLabelQuery,
      variables: {
        where: { id: selectedLabelId },
        data: { labelClassId: labelClassIdPrevious ?? null },
      },
      refetchQueries: ["getImageLabels"],
    });
    await client.mutate({
      mutation: deleteLabelClassQuery,
      variables: {
        where: { id: labelClassId },
      },
      refetchQueries: [{ query: labelClassesQuery }],
    });

    return {
      labelClassId,
      labelClassIdPrevious,
    };
  },
  redo: async ({
    labelClassId,
    labelClassIdPrevious,
  }: {
    labelClassId: string;
    labelClassIdPrevious: string;
  }) => {
    await client.mutate({
      mutation: createLabelClassQuery,
      variables: { data: { name, color, id: labelClassId } },
      refetchQueries: [{ query: labelClassesQuery }],
    });

    await client.mutate({
      mutation: updateLabelQuery,
      variables: {
        where: { id: selectedLabelId },
        data: { labelClassId: labelClassId ?? null },
      },
      refetchQueries: ["getImageLabels"],
    });

    return {
      labelClassId,
      labelClassIdPrevious,
    };
  },
});

const createNewClassFactory =
  ({
    labelClasses,
    perform,
    onClose,
    client,
  }: {
    labelClasses: LabelClass[];
    perform: any;
    onClose: () => void;
    client: ApolloClient<object>;
  }) =>
  async (name: string, selectedLabelId: string | null) => {
    const newClassColor =
      labelClasses.length < 1
        ? hexColorSequence[0]
        : getNextClassColor(labelClasses[labelClasses.length - 1].color);
    perform(
      createCreateLabelClassEffect(
        { name, color: newClassColor, selectedLabelId },
        { client }
      )
    );
    onClose();
  };

const createUpdateLabelClassEffect = (
  {
    selectedLabelId,
    selectedLabelClassId,
  }: { selectedLabelId: string | null; selectedLabelClassId: string | null },
  {
    client,
  }: {
    client: ApolloClient<object>;
  }
): Effect => ({
  do: async () => {
    const {
      data: {
        label: { labelClass },
      },
    } = await client.query({
      query: labelQuery,
      variables: { id: selectedLabelId },
    });

    const labelClassIdPrevious = labelClass?.id ?? null;

    await client.mutate({
      mutation: updateLabelQuery,
      variables: {
        where: { id: selectedLabelId },
        data: { labelClassId: selectedLabelClassId ?? null },
      },
      refetchQueries: ["getImageLabels"],
    });

    return labelClassIdPrevious;
  },
  undo: async (labelClassIdPrevious: string) => {
    await client.mutate({
      mutation: updateLabelQuery,
      variables: {
        where: { id: selectedLabelId },
        data: { labelClassId: labelClassIdPrevious ?? null },
      },
      refetchQueries: ["getImageLabels"],
    });

    return labelClassIdPrevious;
  },
});

export const EditLabelClass = forwardRef<
  HTMLDivElement | null,
  {
    isOpen: boolean;
    onClose: () => void;
  }
>(({ isOpen, onClose }, ref) => {
  const client = useApolloClient();
  const { data } = useQuery(labelClassesQuery);
  const { perform } = useUndoStore();
  const labelClasses = data?.labelClasses ?? [];
  const selectedLabelId = useLabellingStore((state) => state.selectedLabelId);
  const { data: labelQueryData } = useQuery(labelQuery, {
    variables: { id: selectedLabelId },
    skip: selectedLabelId == null,
  });
  const selectedLabelClassId = labelQueryData?.label?.labelClass?.id ?? null;
  const createNewClass = createNewClassFactory({
    labelClasses,
    perform,
    onClose,
    client,
  });

  return (
    <div ref={ref}>
      {isOpen && (
        <ClassSelectionPopover
          isOpen
          onClose={onClose}
          trigger={<div style={{ width: 0, height: 0 }} />} // Needed to have the popover displayed preventing overflow
          labelClasses={labelClasses}
          selectedLabelClassId={selectedLabelClassId}
          createNewClass={async (name) => createNewClass(name, selectedLabelId)}
          onSelectedClassChange={(item) => {
            perform(
              createUpdateLabelClassEffect(
                {
                  selectedLabelId,
                  selectedLabelClassId: item?.id ?? null,
                },
                { client }
              )
            );
            onClose();
          }}
        />
      )}
    </div>
  );
});
