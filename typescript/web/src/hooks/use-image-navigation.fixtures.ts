import {
  GetAllImagesOfADatasetQuery,
  GetAllImagesOfADatasetQueryVariables,
  GetAllImagesOfADatasetQuery_dataset_images,
} from "../graphql-types/GetAllImagesOfADatasetQuery";
import {
  ApolloMockResponse,
  ApolloMockResponses,
} from "../utils/tests/apollo-mock";
import { BASIC_DATASET_DATA } from "../utils/tests/data.fixtures";
import { GET_ALL_IMAGES_OF_A_DATASET_QUERY } from "./use-images-navigation.query";

const EXAMPLE_URL = "https://labelflow.ai/static/icon-512x512.png";

const IMAGES_IDS = [
  "dd5f0305-3d69-457d-9a77-4a46cec0e10b",
  "929f5445-812c-4679-86bd-0f0748679f38",
  "51e00f79-d178-4ea1-8bb5-b0fa647f9d19",
  "8067a965-d017-4c4b-a82d-98cc803d1020",
];

export const [CURRENT_IMAGE_DATA, IMAGE_1_DATA, IMAGE_2_DATA, IMAGE_3_DATA] =
  IMAGES_IDS.map((id) => ({
    id,
    url: EXAMPLE_URL,
    thumbnail200Url: EXAMPLE_URL,
  }));

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
