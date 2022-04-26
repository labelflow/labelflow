import { MATCH_ANY_PARAMETERS } from "wildcard-mock-link";
import {
  CreateManyImagesInModalMutation,
  CreateManyImagesInModalMutationVariables,
} from "../../graphql-types/CreateManyImagesInModalMutation";
import {
  DatasetImagesPageDatasetQuery,
  DatasetImagesPageDatasetQueryVariables,
} from "../../graphql-types/DatasetImagesPageDatasetQuery";
import {
  GetDatasetBySlugQuery,
  GetDatasetBySlugQueryVariables,
} from "../../graphql-types/GetDatasetBySlugQuery";
import {
  GetUploadTargetMutation,
  GetUploadTargetMutationVariables,
} from "../../graphql-types/GetUploadTargetMutation";
import {
  WorkspaceDatasetsPageDatasetsQuery,
  WorkspaceDatasetsPageDatasetsQueryVariables,
} from "../../graphql-types/WorkspaceDatasetsPageDatasetsQuery";
import { DATASET_IMAGES_PAGE_DATASET_QUERY } from "../../shared-queries/dataset-images-page.query";
import { WORKSPACE_DATASETS_PAGE_DATASETS_QUERY } from "../../shared-queries/workspace-datasets-page.query";
import { BASIC_DATASET_DATA } from "../../utils/fixtures";
import {
  ApolloMockResponse,
  ApolloMockResponses,
} from "../../utils/tests/apollo-mock";
import { GET_IMAGE_UPLOAD_TARGET_MUTATION } from "../../utils/upload-file";
import { GET_DATASET_BY_SLUG_QUERY } from "../datasets/datasets.query";
import { CREATE_MANY_IMAGES_MUTATION } from "./import-images-modal/modal-dropzone/import-dropped-files/import-images";

const GET_DATASET_BY_SLUG_MOCK: ApolloMockResponse<
  GetDatasetBySlugQuery,
  GetDatasetBySlugQueryVariables
> = {
  request: {
    query: GET_DATASET_BY_SLUG_QUERY,
    variables: {
      slug: BASIC_DATASET_DATA.slug,
      workspaceSlug: BASIC_DATASET_DATA.workspace.slug,
    },
  },
  result: {
    data: {
      dataset: {
        id: BASIC_DATASET_DATA.id,
        name: BASIC_DATASET_DATA.name,
      },
    },
  },
};

const GET_UPLOAD_TARGET_MOCK: ApolloMockResponse<
  GetUploadTargetMutation,
  GetUploadTargetMutationVariables
> = {
  request: {
    query: GET_IMAGE_UPLOAD_TARGET_MUTATION,
    variables: MATCH_ANY_PARAMETERS,
  },
  result: {
    data: {
      getUploadTarget: {
        downloadUrl: "http://download.test.com",
        uploadUrl: "http://upload.test.com",
      },
    },
  },
  nMatches: Number.POSITIVE_INFINITY,
};

const DATASET_IMAGES_PAGE_DATASET_MOCK: ApolloMockResponse<
  DatasetImagesPageDatasetQuery,
  DatasetImagesPageDatasetQueryVariables
> = {
  request: {
    query: DATASET_IMAGES_PAGE_DATASET_QUERY,
    variables: {
      slug: BASIC_DATASET_DATA.slug,
      workspaceSlug: BASIC_DATASET_DATA.workspace.slug,
    },
  },
  result: {
    data: {
      dataset: {
        ...BASIC_DATASET_DATA,
        imagesAggregates: { totalCount: 2 },
      },
    },
  },
};

const WORKSPACE_DATASETS_PAGE_DATASETS_MOCK: ApolloMockResponse<
  WorkspaceDatasetsPageDatasetsQuery,
  WorkspaceDatasetsPageDatasetsQueryVariables
> = {
  request: {
    query: WORKSPACE_DATASETS_PAGE_DATASETS_QUERY,
    variables: MATCH_ANY_PARAMETERS,
  },
  result: {
    data: {
      datasets: [
        {
          ...BASIC_DATASET_DATA,
          images: [],
          imagesAggregates: { totalCount: 2 },
          labelClassesAggregates: { totalCount: 0 },
          labelsAggregates: { totalCount: 0 },
        },
      ],
    },
  },
};

const CREATE_MANY_IMAGES_IN_MODAL_MOCK: ApolloMockResponse<
  CreateManyImagesInModalMutation,
  CreateManyImagesInModalMutationVariables
> = {
  request: {
    query: CREATE_MANY_IMAGES_MUTATION,
    variables: MATCH_ANY_PARAMETERS,
  },
  result: {
    data: {
      createManyImages: [
        { id: "eb0351f3-c7f1-4489-bd66-ba95d7c162ec" },
        { id: "33f9269f-a62c-486f-b9b2-3e4aceb4be67" },
      ],
    },
  },
};

const ERROR_CREATE_IMAGES_MOCK: ApolloMockResponse<
  CreateManyImagesInModalMutation,
  CreateManyImagesInModalMutationVariables
> = {
  request: {
    query: CREATE_MANY_IMAGES_MUTATION,
    variables: MATCH_ANY_PARAMETERS,
  },
  error: new Error("An error occurred"),
};

export const ERROR_MOCKS: ApolloMockResponses = [
  GET_DATASET_BY_SLUG_MOCK,
  GET_UPLOAD_TARGET_MOCK,
  DATASET_IMAGES_PAGE_DATASET_MOCK,
  WORKSPACE_DATASETS_PAGE_DATASETS_MOCK,
  ERROR_CREATE_IMAGES_MOCK,
];

export const IMPORT_BUTTON_MOCKS: ApolloMockResponses = [
  GET_DATASET_BY_SLUG_MOCK,
  GET_UPLOAD_TARGET_MOCK,
  DATASET_IMAGES_PAGE_DATASET_MOCK,
  WORKSPACE_DATASETS_PAGE_DATASETS_MOCK,
  CREATE_MANY_IMAGES_IN_MODAL_MOCK,
];
