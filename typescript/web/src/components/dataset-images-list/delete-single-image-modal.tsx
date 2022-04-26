import { gql, useQuery } from "@apollo/client";
import { isEmpty } from "lodash/fp";
import {
  GetImageByIdQuery,
  GetImageByIdQueryVariables,
} from "../../graphql-types/GetImageByIdQuery";
import { DeleteModal } from "../core";
import { useImagesList } from "./images-list.context";

export const GET_IMAGE_BY_ID_QUERY = gql`
  query GetImageByIdQuery($id: ID!) {
    image(where: { id: $id }) {
      id
      name
    }
  }
`;

export type DeleteImageModalProps = {
  isOpen: boolean;
  onClose?: () => void;
};

export const DeleteSingleImageModal = ({
  isOpen = false,
  onClose = () => {},
}: DeleteImageModalProps) => {
  const { deleteSingle, deletingSingle, singleToDelete } = useImagesList();
  const { data } = useQuery<GetImageByIdQuery, GetImageByIdQueryVariables>(
    GET_IMAGE_BY_ID_QUERY,
    {
      variables: { id: singleToDelete ?? "" },
      skip: !isOpen || isEmpty(singleToDelete) || deletingSingle,
    }
  );
  const handleDeleteButtonClick = async () => {
    await deleteSingle();
    onClose();
  };
  return (
    <DeleteModal
      isOpen={isOpen}
      onClose={onClose}
      deleting={deletingSingle}
      onDelete={handleDeleteButtonClick}
      header={`Delete image ${data?.image?.name}`}
      body="Are you sure? Labels linked to this image will be deleted. This action cannot be undone."
    />
  );
};
