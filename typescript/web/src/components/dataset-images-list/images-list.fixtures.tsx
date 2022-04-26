import { PropsWithChildren } from "react";
import {
  DatasetImagesPageDatasetQuery,
  DatasetImagesPageDatasetQueryVariables,
  GetImageByIdQuery,
  GetImageByIdQueryVariables,
  PaginatedImagesQuery,
  PaginatedImagesQueryVariables,
} from "../../graphql-types";
import { DATASET_IMAGES_PAGE_DATASET_QUERY } from "../../shared-queries/dataset-images-page.query";
import { DEEP_DATASET_WITH_IMAGES_DATA } from "../../utils/fixtures";
import {
  ApolloMockResponse,
  ApolloMockResponses,
} from "../../utils/tests/apollo-mock";
import { PaginationProvider } from "../core";
import { GET_IMAGE_BY_ID_QUERY } from "./delete-single-image-modal";
import {
  ImagesListProvider,
  ImagesListProviderProps,
} from "./images-list.context";
import { PAGINATED_IMAGES_QUERY } from "./paginated-images-query";

export const [TEST_IMAGE] = DEEP_DATASET_WITH_IMAGES_DATA.images;

const DATASET_IMAGES_PAGE_DATASET_QUERY_MOCKS: ApolloMockResponse<
  DatasetImagesPageDatasetQuery,
  DatasetImagesPageDatasetQueryVariables
> = {
  request: {
    query: DATASET_IMAGES_PAGE_DATASET_QUERY,
    variables: {
      slug: DEEP_DATASET_WITH_IMAGES_DATA.slug,
      workspaceSlug: DEEP_DATASET_WITH_IMAGES_DATA.workspace.slug,
    },
  },
  result: {
    data: {
      dataset: {
        ...DEEP_DATASET_WITH_IMAGES_DATA,
        imagesAggregates: {
          totalCount: DEEP_DATASET_WITH_IMAGES_DATA.images.length,
        },
      },
    },
  },
};

const PAGINATED_IMAGES_QUERY_MOCKS: ApolloMockResponse<
  PaginatedImagesQuery,
  PaginatedImagesQueryVariables
> = {
  request: {
    query: PAGINATED_IMAGES_QUERY,
    variables: {
      datasetId: DEEP_DATASET_WITH_IMAGES_DATA.id,
      first: 50,
      skip: 0,
    },
  },
  result: {
    data: {
      images: DEEP_DATASET_WITH_IMAGES_DATA.images.map(
        ({ thumbnail200Url, ...image }) => ({
          ...image,
          thumbnail500Url: thumbnail200Url,
        })
      ),
    },
  },
};

const GET_IMAGE_BY_ID_QUERY_MOCK: ApolloMockResponse<
  GetImageByIdQuery,
  GetImageByIdQueryVariables
> = {
  request: { query: GET_IMAGE_BY_ID_QUERY, variables: { id: TEST_IMAGE.id } },
  result: { data: { image: { id: TEST_IMAGE.id, name: TEST_IMAGE.name } } },
};

export const APOLLO_MOCKS: ApolloMockResponses = [
  DATASET_IMAGES_PAGE_DATASET_QUERY_MOCKS,
  PAGINATED_IMAGES_QUERY_MOCKS,
  GET_IMAGE_BY_ID_QUERY_MOCK,
];

export type TestWrapperProps = PropsWithChildren<
  Pick<ImagesListProviderProps, "singleToDelete" | "selected">
>;

export const TestWrapper = ({ children, ...props }: TestWrapperProps) => (
  <PaginationProvider
    itemCount={DEEP_DATASET_WITH_IMAGES_DATA.images.length}
    perPageOptions={[50, 250, 1000]}
    perPage={50}
  >
    <ImagesListProvider
      workspaceSlug={DEEP_DATASET_WITH_IMAGES_DATA.workspace.slug}
      datasetSlug={DEEP_DATASET_WITH_IMAGES_DATA.slug}
      datasetId={DEEP_DATASET_WITH_IMAGES_DATA.id}
      imagesTotalCount={DEEP_DATASET_WITH_IMAGES_DATA.images.length}
      {...props}
    >
      {children}
    </ImagesListProvider>
  </PaginationProvider>
);
