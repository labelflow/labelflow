import { gql, MutationOptions } from "@apollo/client";
import { Label } from "@prisma/client";
import { isNil } from "lodash/fp";
import {
  Dataset,
  DatasetCreateInput,
  Image,
  ImageCreateInput,
  LabelClass,
  LabelClassCreateInput,
  LabelCreateInput,
  Mutation,
} from "../../typescript/graphql-types";
import { distantDatabaseClient as client } from "../../typescript/web/src/connectors/apollo-client/client";

type Mutations = Omit<Mutation, "__typename">;

type MutationKey = keyof Mutations;

type MutationResult<TKey extends MutationKey> = NonNullable<Mutations[TKey]>;

const mutate = async <TMutationKey extends MutationKey, TVariables>(
  mutationKey: TMutationKey,
  options: MutationOptions<Pick<Mutations, TMutationKey>, TVariables>
): Promise<MutationResult<TMutationKey>> => {
  const { data, errors } = await client.mutate<
    Pick<Mutations, TMutationKey>,
    TVariables
  >(options);
  const mutationData = data?.[mutationKey];
  if (isNil(mutationData)) {
    throw new Error(errors?.join("\n") || `Unknown GraphQL error`);
  }
  return mutationData as unknown as MutationResult<TMutationKey>;
};

const CREATE_DATASET_MUTATION = gql`
  mutation createDataset($name: String, $workspaceSlug: String) {
    createDataset(data: { name: $name, workspaceSlug: $workspaceSlug }) {
      id
      slug
    }
  }
`;

export type CreateDatasetVariables = Pick<
  DatasetCreateInput,
  "name" | "workspaceSlug"
>;

export type CreateDatasetResult = Pick<Dataset, "id" | "slug">;

export const createDataset = (
  variables: CreateDatasetVariables
): Promise<CreateDatasetResult> =>
  mutate<"createDataset", CreateDatasetVariables>("createDataset", {
    mutation: CREATE_DATASET_MUTATION,
    variables,
  });

const CREATE_IMAGE_MUTATION = gql`
  mutation createImage($url: String, $datasetId: ID!) {
    createImage(data: { url: $url, datasetId: $datasetId }) {
      id
      name
      width
      height
      url
    }
  }
`;

export type CreateImageInput = Pick<ImageCreateInput, "url" | "datasetId">;

export const createImage = (variables: CreateImageInput): Promise<Image> =>
  mutate<"createImage", CreateImageInput>("createImage", {
    mutation: CREATE_IMAGE_MUTATION,
    variables,
  });

const CREATE_LABEL_MUTATION = gql`
  mutation createLabel($data: LabelCreateInput!) {
    createLabel(data: $data) {
      id
    }
  }
`;

export type CreateLabelInput = { data: LabelCreateInput };

export type CreateLabelResult = Pick<Label, "id">;

export const createLabel = (
  variables: CreateLabelInput
): Promise<CreateLabelResult> =>
  mutate<"createLabel", CreateLabelInput>("createLabel", {
    mutation: CREATE_LABEL_MUTATION,
    variables,
  });

const CREATE_LABEL_CLASS_MUTATION = gql`
  mutation createLabelClass($name: String!, $color: String!, $datasetId: ID!) {
    createLabelClass(
      data: { name: $name, color: $color, datasetId: $datasetId }
    ) {
      id
      name
      color
    }
  }
`;

export type CreateLabelClassInput = Pick<
  LabelClassCreateInput,
  "name" | "color" | "datasetId"
>;

export type CreateLabelClassResult = Pick<LabelClass, "id" | "name" | "color">;

export const createLabelClass = ({
  name,
  color = "#ffffff",
  datasetId,
}: CreateLabelClassInput): Promise<CreateLabelClassResult> =>
  mutate<"createLabelClass", CreateLabelClassInput>("createLabelClass", {
    mutation: CREATE_LABEL_CLASS_MUTATION,
    variables: { name, color, datasetId },
  });
