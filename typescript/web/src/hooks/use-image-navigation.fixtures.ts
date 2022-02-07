import { pick } from "lodash/fp";
import {
  GetAllImagesOfADatasetQuery,
  GetAllImagesOfADatasetQueryVariables,
  GetAllImagesOfADatasetQuery_dataset_images,
} from "../graphql-types/GetAllImagesOfADatasetQuery";
import {
  ApolloMockResponse,
  ApolloMockResponses,
} from "../utils/tests/apollo-mock";
import {
  BASIC_DATASET_DATA,
  DEEP_DATASET_WITH_IMAGES_DATA,
} from "../utils/tests/data.fixtures";
import { GET_ALL_IMAGES_OF_A_DATASET_QUERY } from "./use-images-navigation.query";

export const [CURRENT_IMAGE_DATA, IMAGE_1_DATA, IMAGE_2_DATA, IMAGE_3_DATA] = [
  BASIC_DATASET_DATA.images[0],
  ...DEEP_DATASET_WITH_IMAGES_DATA.images,
].map((imageData) => pick(["id", "url", "thumbnail200Url"], imageData));

const CURRENT_IMAGE_IS_FIRST = [CURRENT_IMAGE_DATA, IMAGE_1_DATA, IMAGE_2_DATA];
const CURRENT_IMAGE_IS_SECOND = [
  IMAGE_1_DATA,
  CURRENT_IMAGE_DATA,
  IMAGE_2_DATA,
];
const CURRENT_IMAGE_IS_LAST = [IMAGE_1_DATA, IMAGE_2_DATA, CURRENT_IMAGE_DATA];
const CURRENT_IMAGE_NOT_PRESENT = [IMAGE_1_DATA, IMAGE_2_DATA, IMAGE_3_DATA];

const createImagesGenerator = (
  images: GetAllImagesOfADatasetQuery_dataset_images[]
): ApolloMockResponse<
  GetAllImagesOfADatasetQuery,
  GetAllImagesOfADatasetQueryVariables
> => ({
  request: {
    query: GET_ALL_IMAGES_OF_A_DATASET_QUERY,
    variables: {
      slug: BASIC_DATASET_DATA.slug,
      workspaceSlug: BASIC_DATASET_DATA.workspace.slug,
    },
  },
  result: {
    data: {
      dataset: {
        id: BASIC_DATASET_DATA.id,
        images,
      },
    },
  },
  delay: 10,
});

const createImagesMocks = (
  images: GetAllImagesOfADatasetQuery_dataset_images[]
): ApolloMockResponses => [createImagesGenerator(images)];

export const THREE_IMAGES_MOCKS: ApolloMockResponses = createImagesMocks(
  CURRENT_IMAGE_IS_SECOND
);

export const IMAGE_IS_FIRST_MOCKS: ApolloMockResponses = createImagesMocks(
  CURRENT_IMAGE_IS_FIRST
);

export const IMAGE_IS_LAST_MOCKS: ApolloMockResponses = createImagesMocks(
  CURRENT_IMAGE_IS_LAST
);

export const NO_IMAGES_MOCKS: ApolloMockResponses = createImagesMocks([]);

export const CURRENT_NOT_IN_IMAGES_MOCKS: ApolloMockResponses =
  createImagesMocks(CURRENT_IMAGE_NOT_PRESENT);
