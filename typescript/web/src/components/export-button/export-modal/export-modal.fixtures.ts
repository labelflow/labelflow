import {
  CountLabelsOfDatasetQuery,
  CountLabelsOfDatasetQueryVariables,
} from "../../../graphql-types/CountLabelsOfDatasetQuery";
import {
  ExportDatasetUrlQuery,
  ExportDatasetUrlQueryVariables,
} from "../../../graphql-types/ExportDatasetUrlQuery";
import { ExportFormat } from "../../../graphql-types/globalTypes";
import { BASIC_DATASET_DATA } from "../../../utils/fixtures";
import {
  ApolloMockResponse,
  ApolloMockResponses,
} from "../../../utils/tests/apollo-mock";
import { EXPORT_DATASET_URL_QUERY } from "./export-dataset";
import { COUNT_LABELS_OF_DATASET_QUERY } from "./export-modal.context";
import { DEFAULT_EXPORT_OPTIONS } from "./formats";
import { getDatasetExportName } from "../../../utils";

const datasetName = getDatasetExportName(BASIC_DATASET_DATA.slug);

const EXPORT_DATASET_URL_MOCK: ApolloMockResponse<
  ExportDatasetUrlQuery,
  ExportDatasetUrlQueryVariables
> = {
  request: {
    query: EXPORT_DATASET_URL_QUERY,
    variables: {
      datasetId: BASIC_DATASET_DATA.id,
      format: ExportFormat.COCO,
      options: {
        coco: { ...DEFAULT_EXPORT_OPTIONS.coco, name: datasetName },
        yolo: { ...DEFAULT_EXPORT_OPTIONS.yolo, name: datasetName },
        csv: { ...DEFAULT_EXPORT_OPTIONS.csv, name: datasetName },
      },
    },
  },
  result: {
    data: {
      exportDataset:
        "http://localhost:3000/api/downloads/35f16118-5d52-4d9e-8d4b-8cb1341e98c2",
    },
  },
};

const COUNT_LABELS_OF_DATASET_MOCK: ApolloMockResponse<
  CountLabelsOfDatasetQuery,
  CountLabelsOfDatasetQueryVariables
> = {
  request: {
    query: COUNT_LABELS_OF_DATASET_QUERY,
    variables: {
      slug: BASIC_DATASET_DATA.slug,
      workspaceSlug: BASIC_DATASET_DATA.workspace.slug,
    },
  },
  result: {
    data: {
      dataset: {
        id: BASIC_DATASET_DATA.id,
        imagesAggregates: { totalCount: 1 },
        labelsAggregates: { totalCount: 2 },
      },
    },
  },
};

export const APOLLO_MOCKS: ApolloMockResponses = [
  EXPORT_DATASET_URL_MOCK,
  COUNT_LABELS_OF_DATASET_MOCK,
];
