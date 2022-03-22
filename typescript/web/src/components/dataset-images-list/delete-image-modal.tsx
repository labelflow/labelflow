import { gql, useMutation, useQuery } from "@apollo/client";
import { isEmpty } from "lodash/fp";
import { useRef } from "react";
import {
  GetImageByIdQuery,
  GetImageByIdQueryVariables,
} from "../../graphql-types/GetImageByIdQuery";
import { DATASET_IMAGES_PAGE_DATASET_QUERY } from "../../shared-queries/dataset-images-page.query";
import { DeleteModal } from "./delete-modal";
import { useImagesList } from "./images-list.context";
import {
  PAGINATED_IMAGES_QUERY,
  useFlushPaginatedImagesCache,
} from "./paginated-images-query";

const GET_IMAGE_BY_ID_QUERY = gql`
  query GetImageByIdQuery($id: ID!) {
    image(where: { id: $id }) {
      id
      name
    }
  }
`;

const DELETE_IMAGE_MUTATION = gql`
  mutation DeleteImageMutation($id: ID!) {
    deleteImage(where: { id: $id }) {
      id
    }
  }
`;

export const DeleteImageModal = ({
  isOpen = false,
  onClose = () => {},
  imageId,
  datasetId,
}: {
  isOpen?: boolean;
  onClose?: () => void;
  imageId?: string | null;
  datasetId: string;
}) => {
  const { imagesSelected, setImagesSelected } = useImagesList();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const { data } = useQuery<GetImageByIdQuery, GetImageByIdQueryVariables>(
    GET_IMAGE_BY_ID_QUERY,
    {
      variables: { id: imageId ?? "" },
      skip: isEmpty(imageId),
    }
  );

  const flushPaginatedImagesCache = useFlushPaginatedImagesCache(datasetId);
  const [deleteImage, { loading: deleteImageLoading }] = useMutation(
    DELETE_IMAGE_MUTATION,
    { update: (cache) => cache.evict({ id: `Dataset:${datasetId}` }) }
  );
  const handleDeleteButtonClick = async () => {
    await flushPaginatedImagesCache();
    await deleteImage({
      variables: { id: imageId },
      refetchQueries: [
        DATASET_IMAGES_PAGE_DATASET_QUERY,
        PAGINATED_IMAGES_QUERY,
      ],
      awaitRefetchQueries: true,
    });
    if (imageId) {
      const filteredImages = imagesSelected.filter((id) => id !== imageId);
      setImagesSelected(filteredImages);
    }

    onClose();
  };

  return (
    <DeleteModal
      isOpen={isOpen}
      cancelRef={cancelRef}
      onClose={onClose}
      loading={deleteImageLoading}
      handleDeleteButtonClick={handleDeleteButtonClick}
      header={`Delete image ${data?.image?.name}`}
      body="Are you sure? Labels linked to this image will be deleted. This action can not be undone."
    />
  );
};
